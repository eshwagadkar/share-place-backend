 const express = require('express')

 const router = express.Router()

 const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'Famous Sky Scrappers',
        location: {
            lat: 40.23423,
            long: -231334
        },
        address: 'NewYork, NY 10001',
        creator: 'u1'
    }
 ]

 router.get('/:pid', (req, res, next) => {
    const pid = req.params.pid
    const place = DUMMY_PLACES.find(p => { return p.id === pid})
    
    if(!place) {
        const error = new Error('Could not find a place with the provided ID')
        error.code = 404
        throw error
    }

    res.json({ place })
 })

 router.get('/user/:uid', (req, res, next) => {
    const uid = req.params.uid
    const place = DUMMY_PLACES.find(p => { return p.creator === uid})
    
    if(!place) {
        const error = new Error('Could not find a place with the provided user ID')
        error.code = 404
        throw error
    }

    res.json({ place })
 })

//  router.post('')

 module.exports = router