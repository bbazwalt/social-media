const LoadingText = ({ content }) => {
  return (
    <div className="text-md mt-4 text-center font-semibold">
      {content || "Loading..."}
    </div>
  );
};

export default LoadingText;
