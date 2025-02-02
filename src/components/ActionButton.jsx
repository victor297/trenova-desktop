const ActionButton = ({ icon: Icon, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`border-slate-400 flex h-[30px] w-[40px] cursor-pointer items-center justify-center rounded border ${
        disabled && "cursor-not-allowed opacity-50"
      }`}
    >
      <Icon size={18} />
    </button>
  );
};

export default ActionButton;
