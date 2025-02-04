import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

export function SpotifyPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({
    name: "Not Playing",
    artist: "No Artist",
    albumArt: "/placeholder.svg"
  });
  const { toast } = useToast();

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    toast({
      title: "Spotify Integration",
      description: "This is a demo. Connect your Spotify account to enable music control.",
    });
  };

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
          onClick={() => toast({
            title: "Previous Track",
            description: "Demo: Previous track button pressed",
          })}
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={handlePlayPause}
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
          onClick={() => toast({
            title: "Next Track",
            description: "Demo: Next track button pressed",
          })}
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
              description: `Demo: Volume set to ${value}%`,
            });
          }}
        />
      </div>
    </div>
  );
}