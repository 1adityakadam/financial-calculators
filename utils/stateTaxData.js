export const STATE_TAX_DATA = {
    'AL': { 
        name: 'Alabama',
        brackets: [
            { min: 0, max: 500, rate: 2 },
            { min: 500, max: 3000, rate: 4 },
            { min: 3000, max: Infinity, rate: 5 }
        ]
    },
    'AK': { 
        name: 'Alaska',
        brackets: [{ min: 0, max: Infinity, rate: 0 }]
    },
    'AZ': { 
        name: 'Arizona',
        brackets: [{ min: 0, max: Infinity, rate: 2.5 }]
    },
    'AR': { 
        name: 'Arkansas',
        brackets: [
            { min: 0, max: 4300, rate: 2 },
            { min: 4300, max: 8500, rate: 4 },
            { min: 8500, max: Infinity, rate: 5.9 }
        ]
    },
    'CA': { 
        name: 'California',
        brackets: [
            { min: 0, max: 10099, rate: 1 },
            { min: 10099, max: 23942, rate: 2 },
            { min: 23942, max: 37788, rate: 4 },
            { min: 37788, max: 52455, rate: 6 },
            { min: 52455, max: 66295, rate: 8 },
            { min: 66295, max: 338639, rate: 9.3 },
            { min: 338639, max: 406364, rate: 10.3 },
            { min: 406364, max: 677275, rate: 11.3 },
            { min: 677275, max: Infinity, rate: 12.3 }
        ]
    },
    'CO': { 
        name: 'Colorado',
        brackets: [{ min: 0, max: Infinity, rate: 4.4 }]
    },
    'CT': { 
        name: 'Connecticut',
        brackets: [
            { min: 0, max: 10000, rate: 3 },
            { min: 10000, max: 50000, rate: 5 },
            { min: 50000, max: 100000, rate: 5.5 },
            { min: 100000, max: 200000, rate: 6 },
            { min: 200000, max: 250000, rate: 6.5 },
            { min: 250000, max: 500000, rate: 6.9 },
            { min: 500000, max: Infinity, rate: 6.99 }
        ]
    },
    'DE': { 
        name: 'Delaware',
        brackets: [
            { min: 0, max: 5000, rate: 2.2 },
            { min: 5000, max: 10000, rate: 3.9 },
            { min: 10000, max: 20000, rate: 4.8 },
            { min: 20000, max: 25000, rate: 5.2 },
            { min: 25000, max: 60000, rate: 5.55 },
            { min: 60000, max: Infinity, rate: 6.6 }
        ]
    },
    'FL': { 
        name: 'Florida',
        brackets: [{ min: 0, max: Infinity, rate: 0 }]
    },
    'GA': { 
        name: 'Georgia',
        brackets: [
            { min: 0, max: 750, rate: 1 },
            { min: 750, max: 2250, rate: 2 },
            { min: 2250, max: 3750, rate: 3 },
            { min: 3750, max: 5250, rate: 4 },
            { min: 5250, max: 7000, rate: 5 },
            { min: 7000, max: Infinity, rate: 5.75 }
        ]
    },
    'HI': { 
        name: 'Hawaii',
        brackets: [
            { min: 0, max: 2400, rate: 1.4 },
            { min: 2400, max: 4800, rate: 3.2 },
            { min: 4800, max: 9600, rate: 5.5 },
            { min: 9600, max: 14400, rate: 6.4 },
            { min: 14400, max: 19200, rate: 6.8 },
            { min: 19200, max: 24000, rate: 7.2 },
            { min: 24000, max: 36000, rate: 7.6 },
            { min: 36000, max: 48000, rate: 7.9 },
            { min: 48000, max: 150000, rate: 8.25 },
            { min: 150000, max: 175000, rate: 9 },
            { min: 175000, max: 200000, rate: 10 },
            { min: 200000, max: Infinity, rate: 11 }
        ]
    },
    'ID': { 
        name: 'Idaho',
        brackets: [{ min: 0, max: Infinity, rate: 5.8 }]
    },
    'IL': { 
        name: 'Illinois',
        brackets: [{ min: 0, max: Infinity, rate: 4.95 }]
    },
    'IN': { 
        name: 'Indiana',
        brackets: [{ min: 0, max: Infinity, rate: 3.15 }]
    },
    'IA': { 
        name: 'Iowa',
        brackets: [{ min: 0, max: Infinity, rate: 3.9 }]
    },
    'KS': { 
        name: 'Kansas',
        brackets: [
            { min: 0, max: 15000, rate: 3.1 },
            { min: 15000, max: 30000, rate: 5.25 },
            { min: 30000, max: Infinity, rate: 5.7 }
        ]
    },
    'KY': { 
        name: 'Kentucky',
        brackets: [{ min: 0, max: Infinity, rate: 4.5 }]
    },
    'LA': { 
        name: 'Louisiana',
        brackets: [
            { min: 0, max: 12500, rate: 1.85 },
            { min: 12500, max: 50000, rate: 3.5 },
            { min: 50000, max: Infinity, rate: 4.25 }
        ]
    },
    'ME': { 
        name: 'Maine',
        brackets: [
            { min: 0, max: 24500, rate: 5.8 },
            { min: 24500, max: 58050, rate: 6.75 },
            { min: 58050, max: Infinity, rate: 7.15 }
        ]
    },
    'MD': { 
        name: 'Maryland',
        brackets: [
            { min: 0, max: 1000, rate: 2 },
            { min: 1000, max: 2000, rate: 3 },
            { min: 2000, max: 3000, rate: 4 },
            { min: 3000, max: 100000, rate: 4.75 },
            { min: 100000, max: 125000, rate: 5 },
            { min: 125000, max: 150000, rate: 5.25 },
            { min: 150000, max: 250000, rate: 5.5 },
            { min: 250000, max: Infinity, rate: 5.75 }
        ]
    },
    'MA': { 
        name: 'Massachusetts',
        brackets: [{ min: 0, max: Infinity, rate: 5 }]
    },
    'MI': { 
        name: 'Michigan',
        brackets: [{ min: 0, max: Infinity, rate: 4.25 }]
    },
    'MN': { 
        name: 'Minnesota',
        brackets: [
            { min: 0, max: 30070, rate: 5.35 },
            { min: 30070, max: 98760, rate: 6.8 },
            { min: 98760, max: 183340, rate: 7.85 },
            { min: 183340, max: Infinity, rate: 9.85 }
        ]
    },
    'MS': { 
        name: 'Mississippi',
        brackets: [{ min: 0, max: Infinity, rate: 5 }]
    },
    'MO': { 
        name: 'Missouri',
        brackets: [
            { min: 0, max: 1121, rate: 1.5 },
            { min: 1121, max: 2242, rate: 2 },
            { min: 2242, max: 3363, rate: 2.5 },
            { min: 3363, max: 4484, rate: 3 },
            { min: 4484, max: 5605, rate: 3.5 },
            { min: 5605, max: 6726, rate: 4 },
            { min: 6726, max: 7847, rate: 4.5 },
            { min: 7847, max: 8968, rate: 5 },
            { min: 8968, max: Infinity, rate: 5.3 }
        ]
    },
    'MT': { 
        name: 'Montana',
        brackets: [{ min: 0, max: Infinity, rate: 6.75 }]
    },
    'NE': { 
        name: 'Nebraska',
        brackets: [
            { min: 0, max: 3700, rate: 2.46 },
            { min: 3700, max: 22170, rate: 3.51 },
            { min: 22170, max: 35730, rate: 5.01 },
            { min: 35730, max: Infinity, rate: 6.84 }
        ]
    },
    'NV': { 
        name: 'Nevada',
        brackets: [{ min: 0, max: Infinity, rate: 0 }]
    },
    'NH': { 
        name: 'New Hampshire',
        brackets: [{ min: 0, max: Infinity, rate: 5 }]
    },
    'NJ': { 
        name: 'New Jersey',
        brackets: [
            { min: 0, max: 20000, rate: 1.4 },
            { min: 20000, max: 35000, rate: 1.75 },
            { min: 35000, max: 40000, rate: 3.5 },
            { min: 40000, max: 75000, rate: 5.525 },
            { min: 75000, max: 500000, rate: 6.37 },
            { min: 500000, max: 1000000, rate: 8.97 },
            { min: 1000000, max: Infinity, rate: 10.75 }
        ]
    },
    'NM': { 
        name: 'New Mexico',
        brackets: [
            { min: 0, max: 5500, rate: 1.7 },
            { min: 5500, max: 11000, rate: 3.2 },
            { min: 11000, max: 16000, rate: 4.7 },
            { min: 16000, max: 210000, rate: 4.9 },
            { min: 210000, max: Infinity, rate: 5.9 }
        ]
    },
    'NY': { 
        name: 'New York',
        brackets: [
            { min: 0, max: 8500, rate: 4 },
            { min: 8500, max: 11700, rate: 4.5 },
            { min: 11700, max: 13900, rate: 5.25 },
            { min: 13900, max: 80650, rate: 5.85 },
            { min: 80650, max: 215400, rate: 6.25 },
            { min: 215400, max: 1077550, rate: 6.85 },
            { min: 1077550, max: 5000000, rate: 9.65 },
            { min: 5000000, max: 25000000, rate: 10.3 },
            { min: 25000000, max: Infinity, rate: 10.9 }
        ]
    },
    'NC': { 
        name: 'North Carolina',
        brackets: [{ min: 0, max: Infinity, rate: 4.75 }]
    },
    'ND': { 
        name: 'North Dakota',
        brackets: [
            { min: 0, max: 41775, rate: 1.1 },
            { min: 41775, max: 101050, rate: 2.04 },
            { min: 101050, max: 210825, rate: 2.27 },
            { min: 210825, max: 458350, rate: 2.64 },
            { min: 458350, max: Infinity, rate: 2.9 }
        ]
    },
    'OH': { 
        name: 'Ohio',
        brackets: [
            { min: 0, max: 26050, rate: 2.765 },
            { min: 26050, max: 46100, rate: 3.226 },
            { min: 46100, max: 92150, rate: 3.688 },
            { min: 92150, max: Infinity, rate: 3.99 }
        ]
    },
    'OK': { 
        name: 'Oklahoma',
        brackets: [
            { min: 0, max: 1000, rate: 0.25 },
            { min: 1000, max: 2500, rate: 0.75 },
            { min: 2500, max: 3750, rate: 1.75 },
            { min: 3750, max: 4900, rate: 2.75 },
            { min: 4900, max: 7200, rate: 3.75 },
            { min: 7200, max: Infinity, rate: 4.75 }
        ]
    },
    'OR': { 
        name: 'Oregon',
        brackets: [
            { min: 0, max: 3750, rate: 4.75 },
            { min: 3750, max: 9450, rate: 6.75 },
            { min: 9450, max: 125000, rate: 8.75 },
            { min: 125000, max: Infinity, rate: 9.9 }
        ]
    },
    'PA': { 
        name: 'Pennsylvania',
        brackets: [{ min: 0, max: Infinity, rate: 3.07 }]
    },
    'RI': { 
        name: 'Rhode Island',
        brackets: [
            { min: 0, max: 68200, rate: 3.75 },
            { min: 68200, max: 155050, rate: 4.75 },
            { min: 155050, max: Infinity, rate: 5.99 }
        ]
    },
    'SC': { 
        name: 'South Carolina',
        brackets: [{ min: 0, max: Infinity, rate: 6.5 }]
    },
    'SD': { 
        name: 'South Dakota',
        brackets: [{ min: 0, max: Infinity, rate: 0 }]
    },
    'TN': { 
        name: 'Tennessee',
        brackets: [{ min: 0, max: Infinity, rate: 0 }]
    },
    'TX': { 
        name: 'Texas',
        brackets: [{ min: 0, max: Infinity, rate: 0 }]
    },
    'UT': { 
        name: 'Utah',
        brackets: [{ min: 0, max: Infinity, rate: 4.85 }]
    },
    'VT': { 
        name: 'Vermont',
        brackets: [
            { min: 0, max: 42150, rate: 3.35 },
            { min: 42150, max: 102200, rate: 6.6 },
            { min: 102200, max: 213150, rate: 7.6 },
            { min: 213150, max: Infinity, rate: 8.75 }
        ]
    },
    'VA': { 
        name: 'Virginia',
        brackets: [
            { min: 0, max: 3000, rate: 2 },
            { min: 3000, max: 5000, rate: 3 },
            { min: 5000, max: 17000, rate: 5 },
            { min: 17000, max: Infinity, rate: 5.75 }
        ]
    },
    'WA': { 
        name: 'Washington',
        brackets: [{ min: 0, max: Infinity, rate: 0 }]
    },
    'WV': { 
        name: 'West Virginia',
        brackets: [
            { min: 0, max: 10000, rate: 3 },
            { min: 10000, max: 25000, rate: 4 },
            { min: 25000, max: 40000, rate: 4.5 },
            { min: 40000, max: 60000, rate: 6 },
            { min: 60000, max: Infinity, rate: 6.5 }
        ]
    },
    'WI': { 
        name: 'Wisconsin',
        brackets: [
            { min: 0, max: 13810, rate: 3.54 },
            { min: 13810, max: 27630, rate: 4.65 },
            { min: 27630, max: 304170, rate: 5.3 },
            { min: 304170, max: Infinity, rate: 7.65 }
        ]
    },
    'WY': { 
        name: 'Wyoming',
        brackets: [{ min: 0, max: Infinity, rate: 0 }]
    }
}; 