import PlaceReservation from "../models/PlaceReservation.js";
function reserveTimeChecker(req, res, next){
    var badTiming = false
    const value = req.body.beginTime
    const newDate = new Date()
    newDate.setHours(value.split(':')[0])
    newDate.setMinutes(value.split(':')[1])
    newDate.setMilliseconds(0)
    const newDateNumber = Date.parse(newDate)
    const endDateNumber = Date.parse(newDate) + (parseInt(req.body.reservationDur) * 3600000)
    PlaceReservation.find({namePlace: req.body.namePlace}).sort({beginReservation:'asc'}).exec(function(err, data){
        if(err){
            res.status(500).json({success: false, error: err})
        }else{
            if(!data){
                next()
            }else{
                console.log(data)
                data.forEach(element => {
                   if(newDateNumber >= element.beginReservation && newDateNumber <= element.endReservation){
                       badTiming = true
                   }else if(endDateNumber >= element.beginReservation && endDateNumber <= element.endReservation){
                       badTiming = true
                   }
                });
            }
        }
    })
    if(badTiming === false){
        PlaceReservation.find({namePlace: req.body.namePlace, beginReservation:{$gt: newDateNumber}}).sort({beginReservation:'asc'}).exec(function(err, GtData){
            if(err){
                res.status(500).json({success: false, error: err})
            }else{
                if(GtData.length!==0){
                    console.log('Gt Date is : ', GtData)
                    console.log('end Date Number : ',endDateNumber)
                    console.log('next begin reservation Date Number : ',GtData[0].beginReservation)
                    console.log('endDateNumber>nextBeginReservation : ', endDateNumber>GtData[0].beginReservation)
                    if(endDateNumber >= GtData[0].beginReservation){
                        console.log('im in')
                        badTiming = true
                        res.status(201).json({success: false, message: 'RESERVATION_TIME_TAKEN'})     
                    }
                }else{
                    next()
                }
            }
        })
    }else{
        res.status(201).json({success: false, message: 'RESERVATION_TIME_TAKEN'})     
    }
    console.log('bad timing : ', badTiming)
    // if(badTiming === false){
    //     next()
    // }else{
    //     res.status(201).json({success: false, data: data, message: 'RESERVATION_TIME_TAKEN'})     
    // }
}

export {reserveTimeChecker}