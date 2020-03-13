const fs = require('fs')
const file = 'f_glitch.txt';
const rawFile = fs.readFileSync(file, 'utf8');

const rawFileArray = rawFile.split('\n');

const dimensions = rawFileArray.shift().split(' ');

const map = [];

for (let index = 0; index < Number(dimensions[1]); index++) {
    map.push(rawFileArray.shift().split(''));
}

const developerNumber = Number(rawFileArray.shift());

const developers = [];

const companyWorkers = {}

for (let index = 0; index < developerNumber; index++) {
    const devArray  = rawFileArray.shift().split(' ');

    const developer = {
        company: devArray.shift(),
        bonus: devArray.shift(),
        skillCount: devArray.shift(),
        skills: devArray,
        index
    }

    companyWorkers[developer.company] ? companyWorkers[developer.company]++ : companyWorkers[developer.company] = 1;

    developers.push(developer);
}

const managerNumber = Number(rawFileArray.shift());

const managers = [];

for (let index = 0; index < managerNumber; index++) {
    const managerArray  = rawFileArray.shift().split(' ');

    const manager = {
        company: managerArray.shift(),
        bonus: managerArray.shift(), 
        index
    }

    managers.push(manager);
}

const places = []


for (let index =  0; index < map.length; index++) {
    const row = map[index];

    for (let idx = 0; idx < row.length; idx++) {
        const cell = row[idx];
        if(cell !== '#') {
            const objectKey = `${index}:::${idx}`;

            const placeObject = {
                type: cell,
                places: [],
                key: objectKey   
            }

            if (index > 0) {
                const above = map[index-1][idx];

                if (above !== '#') {
                    const belowObject = {
                        type: above,
                        key: `${index-1}:::${idx}`
                    }
                    placeObject.places.push(belowObject);
                }
            }

            if (idx > 0) {
                const left = map[index][idx-1];

                if (left !== '#') {
                    const belowObject = {
                        type: left,
                        key: `${index}:::${idx-1}`
                    }
                    placeObject.places.push(belowObject);
                }
            }

            if (index < Number(dimensions[1])-1) {
                const below = map[index+1][idx];
                if (below !== '#') {
                    const belowObject = {
                        type: below,
                        key: `${index+1}:::${idx}`
                    }
                    placeObject.places.push(belowObject);
                }
            }

            if (index < Number(dimensions[0])-1) {
                const right = map[index][idx+1];

                if (right && right !== '#') {
                    const belowObject = {
                        type: right,
                        key: `${index}:::${idx+1}`
                    }
                    placeObject.places.push(belowObject);
                }
            }

            placeObject.adjacentDesks = placeObject.places.length;
            
            places.push(placeObject);
        }
    }
}


places.sort((a, b) => {
    return a.adjacentDesks - b.adjacentDesks;
})






for(let developer of developers) {
    developer.companions = companyWorkers[developer.company];
}
for(let manager of managers) {
    manager.companions = companyWorkers[manager.company];
}

developers.sort((a, b) => {
    return b.companions - a.companions || b.company.localeCompare(a.company);
})
// TODO: order manages and developers by bonusfactor (same company vs skills)

//console.log('###', developers);



const setPlaces = {};


for(let place of places) {

    const thisPlace = place

    if(!setPlaces[thisPlace.key]) {
        let thisPlaccePerson;
        switch(thisPlace.type) {
            case 'M':
                thisPlaccePerson = managers.shift()
                break;
            case '_':
                thisPlaccePerson = developers.shift()
                break;
        }
        if (thisPlaccePerson) {
            thisPlace.person = thisPlaccePerson;
            if(thisPlace.type !== thisPlace.person.type){
                console.warn(thisPlace)
            }
            setPlaces[thisPlace.key] = thisPlace.person;
        }
        
        for(let neighbourPlace of place.places) {
            
            if(!neighbourPlace.person && thisPlaccePerson){

                let person;
                switch(neighbourPlace.type) {
                    case 'M':
                        person = managers.shift()
                        break;
                    case '_':
                        person = developers.shift()
                        break;
                }

                if (person) {
                    neighbourPlace.person = person;
                    if(neighbourPlace.type !== neighbourPlace.person.type){
                        console.warn(neighbourPlace)
                    }
                    setPlaces[neighbourPlace.key] = neighbourPlace.person
                }
            }

        }

    }

}

function calcWorker(place) {
    const workers = [];

    for (let subPlace of place.places) {

    }
    if (place.places.length >= 3) {
    }
}

//console.log(setPlaces)

// sorting and returning output
//console.log(setPlaces)
const replyrs = []
for (const plcment in setPlaces) {
    if (setPlaces.hasOwnProperty(plcment)) {        
        const element = Object.assign({},setPlaces[plcment], {placement:plcment});
        replyrs.push(element)
        
    }
}

// TODO: Sort by Type, Developers first, Managers last

const response = [];
const replyerPlacements = (replyers) => {
    const developers = [], managers = [];
    replyers.forEach(rep => {
        rep.skillCount || rep.skillCount === 0 ? developers.push(rep) : managers.push(rep); 
    })

    developers.sort((a, b) => (a.index > b.index) ? 1 : -1)
    managers.sort((a, b) => (a.index > b.index) ? 1 : -1)

    managers.forEach(manager => manager.index += (developerNumber - 1))
    
    replyers = [...developers, ...managers];

    replyers.sort((a, b) => (a.index > b.index) ? 1 : -1)
    const sortedReplyers = replyers;

    for (let index = 0; index < (developerNumber + managerNumber); index++) {
        if (sortedReplyers[0] && sortedReplyers[0].index === index) {
            const replyer = sortedReplyers.shift();            
            response.push(replyer.placement.split(':::').reverse().join(' '))
        } else {
            response.push('X')
        }
    }
}
replyerPlacements(replyrs)

fs.writeFileSync('answer-'+file, response.join('\n'))
