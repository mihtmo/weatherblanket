// Get color given temperature (degrees Fahrenheit)
export function heatColorScale(temp){
    if (temp > 0 && temp <= 15){
        temp = '#2c48b8';
    } else if (temp > 15 && temp <= 25){
        temp = '#429bd6';
    } else if (temp > 25 && temp <= 32){
        temp = '#6bbcd1';
    } else if (temp > 32 && temp <= 45){
        temp = '#9ad0db';
    } else if (temp > 45 && temp <= 62){
        temp = '#bddbd5';
    } else if (temp > 62 && temp <= 67){
        temp = '#fff2ce';
    } else if (temp > 67 && temp <= 72){
        temp = '#f3b938';
    } else if (temp > 72 && temp <= 76.9){
        temp = '#ffa42e';
    } else if (temp > 76.9 && temp <= 78){
        temp = '#fd9415';
    } else if (temp > 78 && temp <= 80){
        temp = '#eb6f02';
    } else if (temp > 80 && temp <= 88){
        temp = '#eb6702';
    } else if (temp > 88 && temp <= 94){
        temp = '#d95700';
    } else if (temp > 94 && temp <= 100){
        temp = '#962101';
    } else if (temp > 100 && temp<= 106){
        temp = '#480300';
    } else {
        temp = '#080000';
    }
    return temp;
}

// Get relative length of rain scale given amount and max
export function rainScale(amount, max){
    const coef = (amount/max);
    return coef;
}

// function rainMMConvert(p, m){
//     inch = Math.round((p * m) * 25.4);
//     rainMM = `${inch}inch`;
//     return rainMM;
// }