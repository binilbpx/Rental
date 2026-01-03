interface StatsTileProps {
  title: string;
  value: number;
  icon?: string;
  color?: 'blue' | 'green' | 'yellow' | 'gray';
}

export default function StatsTile({ title, value, icon, color = 'gray' }: StatsTileProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    gray: 'bg-gray-50 border-gray-200 text-gray-900',
  };

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        {icon && (
          <div className="text-3xl opacity-60">{icon}</div>
        )}
      </div>
    </div>
  );
}

