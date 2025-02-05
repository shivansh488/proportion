import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useSpotifyAuth } from "@/hooks/use-spotify-auth";
import { useSpotifyPlayer } from "@/hooks/use-spotify-player";

export function SpotifyPlayer() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, connectSpotify } = useSpotifyAuth();
  const {
    isReady,
    currentTrack,
    isPlaying,
    togglePlay,
    nextTrack,
    previousTrack,
  } = useSpotifyPlayer();

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="p-4 text-center">
        <Button onClick={connectSpotify}>
          Connect Spotify
        </Button>
      </div>
    );
  }

  if (!isReady) {
    return <div className="p-4 text-center">Initializing player...</div>;
  }

  return (
    <div className="p-4 border-t border-sidebar-border">
      <div className="flex items-center space-x-2 mb-2">
        <img 
          src={currentTrack.albumArt} 
          alt="Album Art" 
          className="w-12 h-12 rounded-md"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{currentTrack.name}</p>
          <p className="text-xs text-sidebar-foreground/70 truncate">
            {currentTrack.artist}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-center space-x-2 mb-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={previousTrack}
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={nextTrack}
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Volume2 className="h-4 w-4" />
        <Slider
          defaultValue={[50]}
          max={100}
          step={1}
          className="w-full"
          onValueChange={(value) => {
            toast({
              title: "Volume Changed",
              description: `Volume set to ${value}%`,
            });
          }}
        />
      </div>
    </div>
  );
}