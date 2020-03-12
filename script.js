const fs = require('fs')
const file = 'a_solar.txt';
const rawFile = fs.readFileSync(file, 'utf8');

const rawFileArray = rawFile.split('\n');

const dimensions = rawFileArray.shift().split(' ');

const map = [];

for (let index = 0; index < Number(dimensions[1]); index++) {
    map.push(rawFileArray.shift().split(''));
}

const developerNumber = Number(rawFileArray.shift());

const developers = [];

for (let index = 0; index < developerNumber; index++) {
    const devArray  = rawFileArray.shift().split(' ');

    const developer = {
        company: devArray.shift(),
        bonus: devArray.shift(),
        skillCount: devArray.shift(),
        skills: devArray
    }

    developers.push(developer);
}

const managerNumber = Number(rawFileArray.shift());

const managers = [];

for (let index = 0; index < managerNumber; index++) {
    const managerArray  = rawFileArray.shift().split(' ');

    const manager = {
        company: managerArray.shift(),
        bonus: managerArray.shift()
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


for(let place of places) {

    const thisPlace = place

    console.log('thisPlace', thisPlace)
    
    for(let desk of place.places) {

        console.log('desk', desk)

        switch(desk.type) {
            case 'M':
            
                // this is a desk for a manager
                // which one should sit here ?

                console.log('this is a desk for a manager, which one should sit here ?')

                break;
            
            case '_':
                
                // this is a desk for a developer
                // which one should sit here ?
                
                break;
        }

    }

}