import React from 'react'
import {Helmet} from 'react-helmet'

export default function Metatags() {
    return (
        <div>
            <Helmet htmlAttributes={{
    lang: 'id',
  }}>
          <meta charSet="utf-8" name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
          <title>Trenutek tišine</title>
          <link rel="icon" href="/logo.png" type="image/png" />
          <meta name="description" content='A simple ASL (American Sign Language) alphabet detection using TensorFlow and Handpose model.'/>
                
        </Helmet>
        </div>
    )
}
