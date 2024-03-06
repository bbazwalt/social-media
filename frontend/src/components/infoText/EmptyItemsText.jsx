const EmptyItemsText = ({ content }) => {
  return (
    <div className="text-md mt-4 text-center font-semibold">
      {"No " + (content || "items") + " found."}
    </div>
  );
};

export default EmptyItemsText;
