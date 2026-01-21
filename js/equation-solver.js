const solverState = {
    pyodide: null,
    solve: null,
    evalExpr: null,
    extractExpr: null
};

const solverEls = {
    form: document.getElementById('solver-form'),
    equation: document.getElementById('equation-input'),
    xmin: document.getElementById('xmin-input'),
    xmax: document.getElementById('xmax-input'),
    status: document.getElementById('solver-status'),
    result: document.getElementById('solver-result'),
    plot: document.getElementById('solver-plot')
};

function setStatus(message) {
    if (solverEls.status) {
        solverEls.status.textContent = message;
    }
}

function formatResult(text) {
    const trimmed = text.trim();
    if (!trimmed) return 'No output.';
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        return trimmed.replace(/,\s*-/g, ', -');
    }
    return trimmed;
}

function splitEquation(equation) {
    const match = equation.match(/(?<![<>])=(?!=)/);
    if (!match || match.index === undefined) return null;
    const index = match.index;
    const lhs = equation.slice(0, index).trim();
    const rhs = equation.slice(index + 1).trim();
    if (!lhs || !rhs) return null;
    return { lhs, rhs };
}

function extractYExpression(equation) {
    const parts = splitEquation(equation);
    if (!parts) return null;
    if (parts.lhs === 'y') return parts.rhs;
    if (parts.rhs === 'y') return parts.lhs;
    return null;
}

function parseValue(value) {
    const trimmed = value.trim();
    if (trimmed === '∞' || trimmed === 'inf') return Infinity;
    if (trimmed === '-∞' || trimmed === '-inf') return -Infinity;
    const parsed = Number.parseFloat(trimmed);
    return Number.isNaN(parsed) ? null : parsed;
}


function parseSolutions(output) {
    const text = output.trim();
    if (!text || text === 'no solution') {
        return { intervals: [], points: [], allReal: false };
    }
    if (text === 'all real numbers') {
        return { intervals: [{ low: -Infinity, high: Infinity, inclusiveLow: false, inclusiveHigh: false }], points: [], allReal: true };
    }

    const points = [];
    const intervals = [];

    const intervalParts = text.split(' U ');
    intervalParts.forEach(part => {
        const trimmed = part.trim();
        if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
            const inner = trimmed.slice(1, -1).trim();
            const value = parseValue(inner);
            if (value !== null && Number.isFinite(value)) {
                points.push(value);
            }
            return;
        }

        const open = trimmed[0];
        const close = trimmed[trimmed.length - 1];
        if ((open === '(' || open === '[') && (close === ')' || close === ']')) {
            const inner = trimmed.slice(1, -1);
            const parts = inner.split(',');
            if (parts.length === 2) {
                const low = parseValue(parts[0]);
                const high = parseValue(parts[1]);
                if (low !== null && high !== null) {
                    intervals.push({
                        low,
                        high,
                        inclusiveLow: open === '[',
                        inclusiveHigh: close === ']'
                    });
                }
            }
        }
    });

    return { intervals, points, allReal: false };
}

function buildIntervalShapes(intervals, xmin, xmax) {
    const shapes = [];
    intervals.forEach(interval => {
        let x0 = interval.low;
        let x1 = interval.high;
        if (!Number.isFinite(x0)) x0 = xmin;
        if (!Number.isFinite(x1)) x1 = xmax;
        if (x0 > x1) return;
        shapes.push({
            type: 'rect',
            xref: 'x',
            yref: 'paper',
            x0,
            x1,
            y0: 0,
            y1: 1,
            fillcolor: 'rgba(76, 141, 170, 0.18)',
            line: { width: 0 }
        });

        if (Number.isFinite(interval.low)) {
            shapes.push({
                type: 'line',
                xref: 'x',
                yref: 'paper',
                x0: interval.low,
                x1: interval.low,
                y0: 0,
                y1: 1,
                line: { color: 'rgba(76, 141, 170, 0.65)', width: 1, dash: interval.inclusiveLow ? 'solid' : 'dot' }
            });
        }

        if (Number.isFinite(interval.high)) {
            shapes.push({
                type: 'line',
                xref: 'x',
                yref: 'paper',
                x0: interval.high,
                x1: interval.high,
                y0: 0,
                y1: 1,
                line: { color: 'rgba(76, 141, 170, 0.65)', width: 1, dash: interval.inclusiveHigh ? 'solid' : 'dot' }
            });
        }
    });
    return shapes;
}

function resizePlot() {
    if (solverEls.plot && solverEls.plot.data) {
        Plotly.Plots.resize(solverEls.plot);
    }
}

async function initSolver() {
    if (!solverEls.form) return;
    setStatus('Loading Pyodide...');
    try {
        solverState.pyodide = await loadPyodide();
        const response = await fetch('../assets/py/web_bundle.py');
        const source = await response.text();
        solverState.pyodide.runPython(source);
        solverState.pyodide.runPython(`
import parsing

def _eval_expr(expr, xs):
    expr_ast = parsing.parse_expr(expr)
    return [parsing.eval_expr_ast(expr_ast, x) for x in xs]

def _extract_expr(equation):
    if any(op in equation for op in ["<=", ">=", "<", ">"]):
        exprs, _ops = parsing.split_inequality(equation)
        if len(exprs) >= 2:
            return f"({exprs[0]})-({exprs[1]})"
    if "=" in equation:
        lhs, rhs = parsing.split_equation(equation)
        return f"({lhs})-({rhs})"
    return equation
        `);
        solverState.solve = solverState.pyodide.globals.get('solve');
        solverState.evalExpr = solverState.pyodide.globals.get('_eval_expr');
        solverState.extractExpr = solverState.pyodide.globals.get('_extract_expr');
        setStatus('Solver ready.');
    } catch (error) {
        console.error('Failed to initialize solver:', error);
        setStatus('Failed to load solver.');
    }
}

async function solveAndPlot(event) {
    event.preventDefault();
    if (!solverState.solve) {
        setStatus('Solver still loading...');
        return;
    }

    const equation = solverEls.equation.value.trim();
    if (!equation) {
        solverEls.result.textContent = 'Please enter an equation or inequality.';
        return;
    }

    const xmin = Number.parseFloat(solverEls.xmin.value);
    const xmax = Number.parseFloat(solverEls.xmax.value);
    if (Number.isNaN(xmin) || Number.isNaN(xmax) || xmin >= xmax) {
        solverEls.result.textContent = 'Please enter a valid x range.';
        return;
    }

    const yExpr = extractYExpression(equation);
    if (yExpr && !/[<>]/.test(equation)) {
        solverEls.result.textContent = `Plotted y = ${yExpr} (solution not computed for multiple variables).`;
        setStatus('Plotting...');
        try {
            const samples = 400;
            const xs = Array.from({ length: samples }, (_, i) => xmin + (i * (xmax - xmin)) / (samples - 1));
            const pyXs = solverState.pyodide.toPy(xs);
            const ys = solverState.evalExpr(yExpr, pyXs).toJs();
            pyXs.destroy();

            const curveTrace = {
                x: xs,
                y: ys,
                mode: 'lines',
                line: { color: '#4c8daa', width: 2.5 },
                name: 'y(x)'
            };

            const layout = {
                margin: { t: 30, r: 20, b: 50, l: 60 },
                xaxis: {
                    title: 'x',
                    range: [xmin, xmax],
                    gridcolor: 'rgba(148, 163, 184, 0.2)',
                    zerolinecolor: 'rgba(71, 85, 105, 0.4)'
                },
                yaxis: {
                    title: 'y',
                    gridcolor: 'rgba(148, 163, 184, 0.2)',
                    zerolinecolor: 'rgba(71, 85, 105, 0.4)'
                },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)'
            };

            Plotly.newPlot(solverEls.plot, [curveTrace], layout, { responsive: true });
            setStatus('Plotted.');
            return;
        } catch (plotError) {
            console.error('Plot fallback failed:', plotError);
            solverEls.result.textContent = `Error: ${plotError.message || plotError}`;
            setStatus('Solve failed.');
            return;
        }
    }

    setStatus('Solving...');
    try {
        const result = solverState.solve(equation, xmin, xmax);
        solverEls.result.textContent = formatResult(result);
        setStatus('Solved.');

        const expr = solverState.extractExpr(equation);
        const samples = 400;
        const xs = Array.from({ length: samples }, (_, i) => xmin + (i * (xmax - xmin)) / (samples - 1));
        const pyXs = solverState.pyodide.toPy(xs);
        const ys = solverState.evalExpr(expr, pyXs).toJs();
        pyXs.destroy();

        const curveTrace = {
            x: xs,
            y: ys,
            mode: 'lines',
            line: { color: '#4c8daa', width: 2.5 },
            name: 'f(x)'
        };

        const solutionInfo = parseSolutions(result);
        const markerTrace = solutionInfo.points.length ? {
            x: solutionInfo.points,
            y: solutionInfo.points.map(() => 0),
            mode: 'markers',
            marker: { color: '#e59300', size: 8 },
            name: 'Solutions'
        } : null;

        const shapes = buildIntervalShapes(solutionInfo.intervals, xmin, xmax);

        const layout = {
            margin: { t: 30, r: 20, b: 50, l: 60 },
            xaxis: {
                title: 'x',
                range: [xmin, xmax],
                gridcolor: 'rgba(148, 163, 184, 0.2)',
                zerolinecolor: 'rgba(71, 85, 105, 0.4)'
            },
            yaxis: {
                title: 'y',
                gridcolor: 'rgba(148, 163, 184, 0.2)',
                zerolinecolor: 'rgba(71, 85, 105, 0.4)'
            },
            shapes,
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            legend: { orientation: 'h' }
        };

        const data = markerTrace ? [curveTrace, markerTrace] : [curveTrace];
        Plotly.newPlot(solverEls.plot, data, layout, { responsive: true }).then(resizePlot);
    } catch (error) {
        const message = error.message || String(error);
        if (message.includes('Multiple variables are not supported') && yExpr) {
            solverEls.result.textContent = `Plotted y = ${yExpr} (solution not computed for multiple variables).`;
            setStatus('Plotting...');
            try {
                const samples = 400;
                const xs = Array.from({ length: samples }, (_, i) => xmin + (i * (xmax - xmin)) / (samples - 1));
                const pyXs = solverState.pyodide.toPy(xs);
                const ys = solverState.evalExpr(yExpr, pyXs).toJs();
                pyXs.destroy();

                const curveTrace = {
                    x: xs,
                    y: ys,
                    mode: 'lines',
                    line: { color: '#4c8daa', width: 2.5 },
                    name: 'y(x)'
                };

                const layout = {
                    margin: { t: 30, r: 20, b: 50, l: 60 },
                    xaxis: {
                        title: 'x',
                        range: [xmin, xmax],
                        gridcolor: 'rgba(148, 163, 184, 0.2)',
                        zerolinecolor: 'rgba(71, 85, 105, 0.4)'
                    },
                    yaxis: {
                        title: 'y',
                        gridcolor: 'rgba(148, 163, 184, 0.2)',
                        zerolinecolor: 'rgba(71, 85, 105, 0.4)'
                    },
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)'
                };

                Plotly.newPlot(solverEls.plot, [curveTrace], layout, { responsive: true }).then(resizePlot);
                setStatus('Plotted.');
                return;
            } catch (plotError) {
                console.error('Plot fallback failed:', plotError);
                solverEls.result.textContent = `Error: ${plotError.message || plotError}`;
                setStatus('Solve failed.');
                return;
            }
        }

        console.error('Solve failed:', error);
        solverEls.result.textContent = `Error: ${message}`;
        setStatus('Solve failed.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initSolver();
    if (solverEls.form) {
        solverEls.form.addEventListener('submit', solveAndPlot);
    }
    window.addEventListener('resize', resizePlot);
});
