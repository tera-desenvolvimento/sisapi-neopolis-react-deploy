import React from "react";

import loadingImg from "../img/loading.gif";

import "../style/loading.css"

function LoadingWrapper() {
    return (
        <div className="loading-container">
            <img src={loadingImg} alt="" />
        </div>
    )
}

export default LoadingWrapper;