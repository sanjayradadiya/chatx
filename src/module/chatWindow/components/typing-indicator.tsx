
export const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1 py-2 px-4">
      <div className="h-2 w-2 rounded-full bg-primary animate-bounce delay-0"></div>
      <div className="h-2 w-2 rounded-full bg-primary animate-bounce delay-300"></div>
      <div className="h-2 w-2 rounded-full bg-primary animate-bounce delay-600"></div>
    </div>
  );
}; 