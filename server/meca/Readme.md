# MECA exporter

xPub component to generate and export a Manuscript Exchange Common Approach (MECA) archive.

## Overview

    const {mecaExport} = require('@elifesciences/xpub-meca-export')

    mecaExport(manuscriptObject, manuscriptContent, clientIp)
        .then(() => console.log('Successfully uploaded archive to SFTP'))
        .catch(err => console.error(err))

## Export callback endpoint

When the MECA archive has been collected from the SFTP server and processed by the third party,
they are expected to call a REST endpoint to notify xPub of the result of the import.

This endpoint is authenticated with an API key and accepts a JSON payload of either
`{"result": "success"}` or `{"result": "failure", "error": "...", ...}` where `error`
should be a textual description of the issue. Other data may be passed in the response
and will be logged.

### Example cURL request

    curl -XPOST https://{host}/meca-result/{manuscript uuid} \
        -H "Authorization: Bearer {api key}" \
        -H "Content-Type: application/json" \
        -d '{"result":"success"}'
