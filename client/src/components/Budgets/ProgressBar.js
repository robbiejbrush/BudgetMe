const ProgressBar = ({ width, color }) => {
  return (
    <div 
      style={{
        backgroundColor: 'var(--third-color)',
        borderRadius: '8px',
        height: '20px',
        overflow: 'hidden',
        marginTop: '0px',
        marginLeft: '20px',
        marginRight: '20px'
      }}
    >
      <div 
        style={{
          width: `${width}%`,
          height: '100%',
          backgroundColor: color,
          transition: 'width 0.5s ease-in-out, background-color 0.3s'
        }} 
      />
    </div>
  );
};

export default ProgressBar;