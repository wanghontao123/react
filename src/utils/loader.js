import React from 'react'
import Loadable from 'react-loadable'

const loadingC = () => <div>loading</div>

export default (loader, loading = loadingC) => {
    return Loadable({
        loader,
        loading
    })
}