const Spinner = () => {
  return (
    <div className="d-flex">
      <div
        className="spinner-border text-black-50 m-auto"
        role="status"
        aria-hidden="true"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
