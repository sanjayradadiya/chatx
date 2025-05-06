import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, X, Paperclip, Send, CircleStop } from "lucide-react";
import { TypingIndicator } from "./components/typing-indicator";
import { MarkdownRenderer } from "@/module/chatWindow/components/markdown-renderer";
import { useChat } from "./hooks/useChat";
import { Link, useParams } from "react-router";
import { useEffect } from "react";

const ChatWindow = () => {
  const {
    messages,
    loading,
    isStreaming,
    streamingMessage,
    selectedFile,
    imagePreview,
    isSending,
    isSubmitting,
    messageValue,
    scrollAreaRef,
    fileInputRef,
    userProfile,
    hasReachedLimit,
    questionLimit,
    userQuestionCount,
    isSidebarExpanded,
    renderMessage,
    handleSubmit,
    onSubmit,
    register,
    handleFileChange,
    handleFileButtonClick,
    clearSelectedFile,
    stopResponseStreaming,
    contentRef,
  } = useChat();
  const { id } = useParams();

  useEffect(() => {
    // Scroll if streaming messages are coming in
    if (isStreaming && streamingMessage !== null) {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }
      return;
    }

    // Scroll if new messages were added (not just during initial load)
    if (messages.length && id) {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollIntoView({
          behavior: "instant",
          block: "end",
          inline: "nearest",
        });
      }
    }
  }, [messages, id, isStreaming, streamingMessage, scrollAreaRef]);

  return (
    <div className="flex flex-col" ref={scrollAreaRef}>
      {/* Chat messages */}
      <div className="flex-1 overflow-auto p-4 w-full h-full mb-44 mx-auto max-w-4xl">
        <div className="flex flex-col gap-4">
          {messages.length === 0 && !isStreaming ? (
            <div className="flex flex-col items-center justify-center h-48 gap-4 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">
                  How can I help you today?
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
                  Send a message to start chatting with the AI assistant. Try
                  asking a question or sharing something interesting!
                </p>
              </div>
            </div>
          ) : (
            <div ref={contentRef}>
              {/* Display all existing messages */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${
                    !msg.is_ai ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.is_ai && (
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>
                        <Bot />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-3 py-2 text-sm max-w-[75%] ${
                      !msg.is_ai
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {renderMessage(msg)}
                  </div>
                  {!msg.is_ai && (
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={userProfile.avatarUrl}
                        alt={userProfile.full_name || "User"}
                      />
                      <AvatarFallback>Me</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {/* Display streaming message */}
              {isStreaming && streamingMessage !== null && (
                <div className="flex items-start gap-2 justify-start">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>
                      <Bot />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg px-3 py-2 text-sm max-w-[75%] bg-muted">
                    <MarkdownRenderer>{streamingMessage}</MarkdownRenderer>
                  </div>
                </div>
              )}
            </div>
          )}

          {loading && !isStreaming && (
            <div className="flex items-start gap-2 justify-start">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  <Bot />
                </AvatarFallback>
              </Avatar>
              <div className="rounded-lg px-3 py-2 text-sm bg-muted">
                <TypingIndicator />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message input - fixed at bottom */}
      <div
        className={`fixed bottom-0 ${
          isSidebarExpanded ? "left-64" : "left-0"
        } right-0 bg-background`}
      >
        <div className="mx-auto max-w-4xl p-4">
          {imagePreview && (
            <div className="mb-3 relative">
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-24 rounded-md object-cover border border-input"
                />
                <button
                  onClick={clearSelectedFile}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground p-1 rounded-full"
                  aria-label="Remove image"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Question limit indicator */}
          {questionLimit < Infinity && (
            <div className="mb-2 text-xs flex justify-between items-center">
              <span className={`${hasReachedLimit ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
                {userQuestionCount} / {questionLimit}
              </span>
              {hasReachedLimit && (
                <Link to="/subscription" className="text-primary font-medium hover:underline">
                  Upgrade your plan to ask more questions
                </Link>
              )}
            </div>
          )}

          <form
            className="flex items-end gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              id="image-upload"
              aria-label="Upload image"
              disabled={hasReachedLimit}
            />

            <div className="flex-1 relative">
              <div className={`relative rounded-xl border shadow-sm bg-background overflow-hidden focus-within:ring-1 focus-within:ring-primary/50 ${hasReachedLimit ? 'opacity-50' : ''}`}>
                <div className="flex items-end">
                  <div className="flex-1 py-2 px-3">
                    <Input
                      placeholder={hasReachedLimit ? "Question limit reached. Upgrade your plan to continue." : "Ask me anything..."}
                      disabled={loading || isSending || isSubmitting || hasReachedLimit}
                      className="pr-10 bg-transparent border-none shadow-none focus-visible:ring-0"
                      aria-label="Message input"
                      {...register("message")}
                    />
                    <div className="flex items-center py-2 px-3 justify-between">
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 cursor-pointer"
                        onClick={handleFileButtonClick}
                        disabled={
                          loading ||
                          isSending ||
                          isSubmitting ||
                          !!selectedFile ||
                          isStreaming ||
                          hasReachedLimit
                        }
                        aria-label="Upload image"
                        title="Upload image"
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      {isStreaming ? (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={stopResponseStreaming}
                          className="h-8 w-8 cursor-pointer"
                          aria-label="Stop Response"
                          title="Stop Response"
                        >
                          <CircleStop className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          variant="secondary"
                          size="icon"
                        className={`h-8 w-8 cursor-pointer ${
                          (!messageValue?.trim() && !selectedFile) ||
                          isStreaming || hasReachedLimit
                            ? "text-muted-foreground"
                            : "text-primary"
                        }`}
                        disabled={
                          loading ||
                          isSending ||
                          isSubmitting ||
                          (!messageValue?.trim() && !selectedFile) ||
                          isStreaming ||
                          hasReachedLimit
                        }
                        aria-label="Send message"
                        title="Send message"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Helper text below input */}
              <div className="text-center text-xs text-muted-foreground mt-2">
                AI responses may not be 100% accurate. Always verify important
                information.
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
