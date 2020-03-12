const fs = require('fs')
const file = 'b_dream.txt';
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
            const objectKey = `${index}${idx}`;

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
                        key: `${index-1}${idx}`
                    }
                    placeObject.places.push(belowObject);
                }
            }

            if (idx > 0) {
                const left = map[index][idx-1];

                if (left !== '#') {
                    const belowObject = {
                        type: left,
                        key: `${index}${idx-1}`
                    }
                    placeObject.places.push(belowObject);
                }
            }

            if (index < Number(dimensions[1])-1) {
                const below = map[index+1][idx];
                if (below !== '#') {
                    const belowObject = {
                        type: below,
                        key: `${index+1}${idx}`
                    }
                    placeObject.places.push(belowObject);
                }
            }

            if (index < Number(dimensions[0])-1) {
                const right = map[index][idx+1];

                if (right && right !== '#') {
                    const belowObject = {
                        type: right,
                        key: `${index}${idx+1}`
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

console.log('###', developers);



const setPlaces = {};


for(let place of places) {

    const thisPlace = place

    if(!setPlaces[thisPlace.key]) {

        switch(thisPlace.type) {
            case 'M':
                thisPlace.person = managers.shift()
                break;
            case '_':
                thisPlace.person = developers.shift()
                break;
        }

        setPlaces[thisPlace.key] = thisPlace.person;
        
        for(let neighbourPlace of place.places) {
            
            if (!neighbourPlace.person) {
                switch(neighbourPlace.type) {
                    case 'M':
                        neighbourPlace.person = managers.shift()
                        break;
                    case '_':
                        neighbourPlace.person = developers.shift()
                        break;
                }
                
                setPlaces[neighbourPlace.key] = neighbourPlace.person
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

console.log(setPlaces)
