import ReactPlayer from 'react-player'


function VideoPlayer({ url }) {
  // console.log(url,"url")
  return (
    <div className="aspect-w-16 aspect-h-9">
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls
        playing
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload'
            },
            forceVideo: true
          }
        }}
      />
    </div>
  )
}

export default VideoPlayer