import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
} from 'recharts';
import {
  TARGET_LOW,
  TARGET_HIGH,
  CHART_Y_MIN,
  CHART_Y_MAX,
} from '../data/constants';

interface GlucoseChartProps {
  baseline: number[];
  scenario?: number[];
}

interface ChartDataPoint {
  hour: number;
  hourLabel: string;
  baseline: number;
  scenario?: number;
}

interface PayloadItem {
  dataKey: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: PayloadItem[];
  label?: string;
}

function formatHour(hour: number): string {
  return `${hour.toString().padStart(2, '0')}:00`;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const baselineValue = payload.find((p) => p.dataKey === 'baseline')?.value;
  const scenarioValue = payload.find((p) => p.dataKey === 'scenario')?.value;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {baselineValue !== undefined && (
        <p className="text-gray-500">
          Baseline: <span className="font-medium">{baselineValue.toFixed(1)} mmol/L</span>
        </p>
      )}
      {scenarioValue !== undefined && (
        <p className="text-blue-600">
          Scenario: <span className="font-medium">{scenarioValue.toFixed(1)} mmol/L</span>
        </p>
      )}
      {baselineValue !== undefined && scenarioValue !== undefined && (
        <p className="text-gray-600 mt-1 pt-1 border-t border-gray-100">
          Δ: <span className={scenarioValue < baselineValue ? 'text-green-600' : scenarioValue > baselineValue ? 'text-red-600' : ''}>
            {(scenarioValue - baselineValue) > 0 ? '+' : ''}
            {(scenarioValue - baselineValue).toFixed(1)} mmol/L
          </span>
        </p>
      )}
    </div>
  );
}

export function GlucoseChart({ baseline, scenario }: GlucoseChartProps) {
  // Transform data for Recharts
  const data: ChartDataPoint[] = baseline.map((value, index) => ({
    hour: index,
    hourLabel: formatHour(index),
    baseline: value,
    scenario: scenario?.[index],
  }));

  // X-axis tick positions (every 6 hours)
  const xAxisTicks = [0, 6, 12, 18];

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          {/* Target range band */}
          <ReferenceArea
            y1={TARGET_LOW}
            y2={TARGET_HIGH}
            fill="#22c55e"
            fillOpacity={0.15}
          />

          <XAxis
            dataKey="hourLabel"
            ticks={xAxisTicks.map(formatHour)}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
          />

          <YAxis
            domain={[CHART_Y_MIN, CHART_Y_MAX]}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
            label={{
              value: 'mmol/L',
              angle: -90,
              position: 'insideLeft',
              style: { fill: '#6b7280', fontSize: 12 },
            }}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Baseline line - grey dashed */}
          <Line
            type="monotone"
            dataKey="baseline"
            stroke="#9ca3af"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Baseline"
          />

          {/* Scenario line - blue solid (only if scenario data exists) */}
          {scenario && (
            <Line
              type="monotone"
              dataKey="scenario"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="Scenario"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
