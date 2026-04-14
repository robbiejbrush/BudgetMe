const ProgressBar = ({ width, color }) => {
  return (
    <div 
      className="ProgressBarContainer"
      style={{
        backgroundColor: '#e0e0e0',
        borderRadius: '8px',
        height: '20px',
        overflow: 'hidden',
        marginTop: '10px'
      }}
    >
      <div 
        className="ProgressBarFiller"
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