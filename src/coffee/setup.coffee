"use strict"

$('#fileupload').fileupload { dataType: 'json' }

# dropElems = ".drop-zone"

# # Kill default behavior
# $(".container").on "dragenter dragleave dragover drop", (e) ->
#     e.stopPropagation()
#     e.preventDefault()

# $(".container").on "drop", dropElems,(e)->
#     console.log "rofl"

# handleDrop = (event) ->
#     event.stopPropagation()
#     event.preventDefault()
#     console.log evt
#     return false