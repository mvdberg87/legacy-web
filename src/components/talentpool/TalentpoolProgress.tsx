type Props = {
  step: number;
  totalSteps: number;
};

export default function TalentpoolProgress({
  step,
  totalSteps,
}: Props) {
  const percentage = ((step + 1) / totalSteps) * 100;

  return (
    <div className="mb-8">

      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-white/90">
          Stap {step + 1} van {totalSteps}
        </span>

        <span className="text-sm text-white/70">
          {Math.round(percentage)}%
        </span>
      </div>

      <div className="h-2 rounded-full bg-white/20 overflow-hidden">
        <div
          className="h-full rounded-full bg-white transition-all duration-300"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

    </div>
  );
}