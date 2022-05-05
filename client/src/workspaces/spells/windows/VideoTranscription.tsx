import VideoInput from '@/screens/HomeScreen/components/VideoInput'
import Window from '../../../components/Window/Window'

import '../../../screens/Thoth/thoth.module.css'
import axios from 'axios'

const VideoTranscription = () => {
    const loadFile = selectedFile => {
        uploadFile(selectedFile)
    }

    const uploadFile = async(file) => {
        console.log(file,'selectedFile')
        // let formData = new FormData();
        // let url = `${process.env.REACT_APP_SEARCH_SERVER_URL}/`
        let url = 'http://localhost:8001'
        let body = file?.name;

        await axios.post(url,  {
            'url': body
        }).then((response) => {
            console.log(response,'response')
        }).catch((error) => {
            console.log(error,'error');
        });
    }

    return (
        <Window>
        <p>Upload Video</p>
        <VideoInput loadFile={loadFile} />
        </Window>
    )
}

export default VideoTranscription