import { MotiView } from 'moti';

export const Indicator = ({ size }: { size: number }) => {
  return (
    <MotiView
      from={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 0,
        shadowOpacity: 0.5,
      }}
      animate={{
        width: size + 15,
        height: size + 15,
        borderRadius: (size + 10) / 2,
        borderWidth: size / 12,
        shadowOpacity: 1,
      }}
      transition={{ type: 'timing', duration: 800, loop: true, repeatReverse: true }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: size / 12,
        borderColor: '#ffffff',
        shadowColor: '#ffffff',
        // shadowColor: 'red',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 2,
        shadowRadius: 10,
        backgroundColor: 'transparent',
      }}
    />
  );
};
