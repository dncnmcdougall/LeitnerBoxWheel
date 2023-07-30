const bounds = {
    'width': 900,
    'height': 1800
};
const centre = {
    'x': Math.round(bounds.width/2),
    'y': Math.round(bounds.width/2),
};

const innerR =  220
const outerR = bounds.width*0.9/2

var canvas = document.getElementById('canvas');
canvas.width = bounds.width;
canvas.height = bounds.height;
var ctx = canvas.getContext('2d');

class Counter {
    constructor(offset, every, color) {
        this.offset=offset;
        this.every=every;
        this.color=color;
    }

    shouldCount(i) {
        return (i+this.offset)%this.every == 0;
    }
}

function drawArcBlock(ctx, centre, innerR, outerR, startAngle, endAngle) {
    ctx.arc(centre.x,centre.y,  innerR, startAngle, endAngle, false);
    ctx.lineTo(centre.x+outerR*Math.cos(endAngle),centre.y+outerR*Math.sin(endAngle))
    ctx.arc(centre.x,centre.y,  outerR, endAngle, startAngle, true);
    ctx.lineTo(centre.x+innerR*Math.cos(startAngle),centre.y+innerR*Math.sin(startAngle))
}

function findFracs(outerR, deltaR, dAngle, counters)
{
    let fracs = [];
    const ourterArcLength = 2*outerR*dAngle
    const dR = Math.round(deltaR/counters.length)

    let totalFrac = 0;
    fracs.push(totalFrac);
    for(let i=0;i<counters.length;i++){
        let arcLength = 2*(innerR+dR*i);
        totalFrac += arcLength/ourterArcLength;
        fracs.push(totalFrac);
    }
    for(let i=0;i<fracs.length;i++){
        fracs[i] = fracs[i]/totalFrac;
    }
    return fracs;
}

let counters = [];
let colours = [
'#ee4035',
'#f37736',
'#ffdb13',
'#7bc043',
'#0392cf',
'#673888',
'#ef4f91',
];

for( let i=0;i<7;i++) {
    n = Math.pow(2,i);
    counters.push(new Counter(Math.round(n/2), n, colours[i%colours.length]));
}

const last = 2*counters.at(-1).offset

const deltaR = outerR-innerR;
const dAngle = (2*Math.PI)/(last);

const fracs = findFracs(outerR, deltaR, dAngle, counters)

ctx.beginPath();
ctx.fillStyle = '#000';
ctx.arc(centre.x, centre.y, 5, 0, Math.PI*2);
ctx.fill();

for(let i=0;i<last;i++) {
    let startAngle = i*dAngle
    let endAngle = (i+1)*dAngle
    let val = (i+1).toString()+': ';
    for(let j=0;j<counters.length;j++){
        counter = counters.at(-(j+1))
        ctx.beginPath();
        ctx.strokeStyle = '#000';
        ctx.fillStyle = counter.color;

        drawArcBlock(ctx,centre
            , innerR+ fracs[j]*deltaR
            , innerR+ fracs[j+1]*deltaR
            , startAngle, endAngle);
        if (counter.shouldCount(i)) {
            val += Math.round(j).toString()+ ' ';
            ctx.fill();
        } else {
            val += '  ';
        }
        ctx.stroke();
    }
    y = innerR+fracs.at(-2)*deltaR
    height = (fracs.at(-1)-fracs.at(-2))*deltaR
    width = dAngle*y

    ctx.fillStyle = '#000'
    ctx.font = ''+(Math.round(height*0.6)).toString()+'px serif'
    ctx.setTransform(1,0,0,1,0,0);
    ctx.translate(centre.x, centre.y);
    ctx.rotate( Math.PI/2+startAngle);
    textSize = ctx.measureText((i+1).toString())
    ctx.fillText((i+1).toString()
        , (width-textSize.width)/2
        , -y-(height-textSize.actualBoundingBoxAscent)/2
    );
    ctx.setTransform(1,0,0,1,0,0);
}

ctx.beginPath();
ctx.fillStyle = '#000';
ctx.strokeStyle = '#000';
ctx.lineWidth = 4;
newCentre = {
        'x': centre.x,
        'y': centre.y + 2*outerR+20,
}
drawArcBlock(ctx
    , newCentre
    , innerR
    , outerR
    , 0, dAngle);

ctx.moveTo(newCentre.x+outerR*1.02, newCentre.y)
ctx.arc(newCentre.x, newCentre.y, outerR*1.02, 0, Math.PI*2);
ctx.stroke();

ctx.beginPath();
ctx.fillStyle = '#000';
ctx.arc(newCentre.x, newCentre.y, 5, 0, Math.PI*2);
ctx.fill();
