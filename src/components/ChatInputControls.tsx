import { ContextFilesPicker } from "./ContextFilesPicker";
import { ModelPicker } from "./ModelPicker";
import { ReworkModeSelector } from "./ReworkModeSelector";
import { ChatModeSelector } from "./ChatModeSelector";

export function ChatInputControls({
  showContextFilesPicker = false,
  appId,
}: {
  showContextFilesPicker?: boolean;
  appId?: number;
}) {
  return (
    <div className="flex">
      <ChatModeSelector />
      <div className="w-1.5"></div>
      <ModelPicker />
      <div className="w-1.5"></div>
      <ReworkModeSelector appId={appId} />
      <div className="w-1"></div>
      {showContextFilesPicker && (
        <>
          <ContextFilesPicker />
          <div className="w-0.5"></div>
        </>
      )}
    </div>
  );
}
