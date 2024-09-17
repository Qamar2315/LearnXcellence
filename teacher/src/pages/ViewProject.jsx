import React from 'react'
import { useParams } from 'react-router-dom'

function ViewProject() {
    let { projectId } = useParams();
  return (
    <div>This is View Project page Project ID: {projectId} </div>
  )
}

export default ViewProject