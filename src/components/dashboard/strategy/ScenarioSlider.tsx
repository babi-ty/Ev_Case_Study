import { Slider } from '@/components/ui/slider';
import { Zap } from 'lucide-react';

interface ScenarioSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function ScenarioSlider({ value, onChange }: ScenarioSliderProps) {
  const intensityLabels = [
    { value: 20, label: 'Conservative', desc: 'Minimal resource shift' },
    { value: 40, label: 'Balanced', desc: 'Moderate focus' },
    { value: 60, label: 'Aggressive', desc: 'Heavy concentration' },
    { value: 80, label: 'All-In', desc: 'Maximum focus' },
  ];

  const currentLabel = intensityLabels.reduce((prev, curr) => 
    Math.abs(curr.value - value) < Math.abs(prev.value - value) ? curr : prev
  );

  return (
    <div className="relative overflow-hidden rounded-xl bg-card/80 backdrop-blur-sm border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/20">
            <Zap className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-foreground">Focus Intensity</h3>
            <p className="text-sm text-muted-foreground">Adjust resource allocation to Top 10 states</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold font-display text-accent">{value}%</p>
          <p className="text-xs text-muted-foreground">{currentLabel.label}</p>
        </div>
      </div>

      {/* Slider */}
      <div className="mb-4">
        <Slider
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          min={10}
          max={80}
          step={5}
          className="cursor-pointer"
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        {intensityLabels.map((label) => (
          <div key={label.value} className="text-center">
            <p className={value >= label.value - 10 && value <= label.value + 10 ? 'text-accent font-medium' : ''}>
              {label.value}%
            </p>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="mt-4 p-3 rounded-lg bg-muted/20 border border-border/50">
        <p className="text-sm text-muted-foreground">
          <span className="text-accent font-medium">{currentLabel.label}:</span> {currentLabel.desc}. 
          Shifting {value}% of resources from uniform distribution to Top 10 high-potential states.
        </p>
      </div>
    </div>
  );
}
