
import React from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
}

// Simple placeholder QR code component (in a real app, you'd use a proper QR code library)
const QRCode: React.FC<QRCodeProps> = ({ value, size = 200 }) => {
  return (
    <div className="mx-auto" style={{ width: size, height: size }}>
      <div className="bg-white p-4 rounded-lg">
        <div className="flex flex-col items-center justify-center">
          <div className="grid grid-cols-7 gap-1">
            {/* This creates a simple pattern that looks like a QR code */}
            {Array(49).fill(0).map((_, i) => {
              // Generate a pseudo-random pattern based on the value string
              const shouldFill = (
                (i < 7 || i >= 42 || i % 7 === 0 || i % 7 === 6) ||
                (i >= 14 && i <= 20 && i % 7 >= 2 && i % 7 <= 4) ||
                (i >= 28 && i <= 34 && i % 7 >= 2 && i % 7 <= 4) ||
                ((i + value.length) % 3 === 0)
              );
              
              return (
                <div 
                  key={i} 
                  className={`w-6 h-6 ${shouldFill ? 'bg-black' : 'bg-white'}`}
                ></div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCode;
