import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { GraphUnit, PredictionResponseUnit } from "./prediction-types";

interface LocalParams {
  data: GraphUnit[];
}

const PredictionGraph = (params: LocalParams) => {
  const { data } = params;

  return (
    <>
      <LineChart
        width={1200}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="uv"
          name="к-сть продажів"
          data={data}
          stroke="#82ca9d"
        />
      </LineChart>
    </>
  );
};

export default PredictionGraph;
