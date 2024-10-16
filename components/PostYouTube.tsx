function PostYouTube({ YouTubeID }) {
  return (
    <div className="w-min rounded-xl border border-gray-300 bg-white p-4">
      <iframe
        width="518"
        height="315"
        src={`https://www.youtube.com/embed/${YouTubeID}?autoplay=0&mute=0`}
        title="YouTube video player"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      ></iframe>
    </div>
  )
}

export default PostYouTube
