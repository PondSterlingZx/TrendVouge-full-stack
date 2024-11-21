const ErrorState = ({ message }) => (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500 mb-2">{message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-sm text-blue-500 hover:underline"
        >
          Reload
        </button>
      </div>
    </div>
  );