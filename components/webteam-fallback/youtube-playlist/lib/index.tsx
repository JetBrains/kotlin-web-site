import React, { FC } from 'react';

import YoutubePlayer from '@jetbrains/kotlin-web-site-ui/out/components/youtube-player';

interface YoutubePlaylistProps {
    playlistId: string;
    playlistTitle: string;
}

const YoutubePlaylist: FC<YoutubePlaylistProps> = ({ playlistId, playlistTitle }) => {
    return (
        <YoutubePlayer
            mode={1}
            id={playlistId}
        />
    );
};

export default YoutubePlaylist;
