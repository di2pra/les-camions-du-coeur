const shuffleArray = array => {

  let tempArray = array;

  for (let i = tempArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = tempArray[i];
    tempArray[i] = tempArray[j];
    tempArray[j] = temp;
  }

  return tempArray
}

const data = {
  participants: [
    {
      id: "USER_1",
      pref: [
        "SOUPE",
        "CAFE",
        "PLAT_CHAUD",
        "ACCOMPAGNEMENT"
      ]
    },
    {
      id: "USER_2",
      pref: [
        "PLAT_CHAUD",
        "CAFE",
        "ACCOMPAGNEMENT",
        "SOUPE"
      ]
    },
    {
      id: "USER_3",
      pref: [
        "CAFE",
        "PLAT_CHAUD",
        "ACCOMPAGNEMENT",
        "SOUPE"
      ]
    },
    {
      id: "USER_4",
      pref: [
        "SOUPE",
        "PLAT_CHAUD",
        "ACCOMPAGNEMENT",
        "CAFE"
      ]
    },
    {
      id: "USER_5",
      pref: [
        "PLAT_CHAUD",
        "CAFE",
        "SOUPE",
        "ACCOMPAGNEMENT"
      ]
    },
    {
      id: "USER_6",
      pref: [
        "CAFE",
        "ACCOMPAGNEMENT",
        "PLAT_CHAUD",
        "SOUPE"
      ]
    },
    {
      id: "USER_7",
      pref: [
        "CAFE",
        "PLAT_CHAUD",
        "ACCOMPAGNEMENT",
        "SOUPE"
      ]
    },
    {
      id: "USER_8",
      pref: [
        "CAFE",
        "PLAT_CHAUD",
        "ACCOMPAGNEMENT",
        "SOUPE"
      ]
    },
    {
      id: "USER_9",
      pref: [
        "CAFE",
        "PLAT_CHAUD",
        "ACCOMPAGNEMENT",
        "SOUPE"
      ]
    }/*,
    {
      id: "USER_10",
      pref: [
        "CAFE",
        "PLAT_CHAUD",
        "ACCOMPAGNEMENT",
        "SOUPE"
      ]
    },
    {
      id: "USER_11",
      pref: [
        "CAFE",
        "PLAT_CHAUD",
        "ACCOMPAGNEMENT",
        "SOUPE"
      ]
    },
    {
      id: "USER_12",
      pref: [
        "CAFE",
        "PLAT_CHAUD",
        "ACCOMPAGNEMENT",
        "SOUPE"
      ]
    },
    {
      id: "USER_13",
      pref: [
        "CAFE",
        "PLAT_CHAUD",
        "ACCOMPAGNEMENT",
        "SOUPE"
      ]
    },
    {
      id: "USER_14",
      pref: [
        "CAFE",
        "PLAT_CHAUD",
        "SOUPE",
        "ACCOMPAGNEMENT"
      ]
    },
    {
      id: "USER_15",
      pref: [
        "PLAT_CHAUD",
        "SOUPE",
        "CAFE",
        "ACCOMPAGNEMENT"
      ]
    },
    {
      id: "USER_16",
      pref: [
        "SOUPE",
        "PLAT_CHAUD",
        "ACCOMPAGNEMENT",
        "CAFE"
      ]
    },
    {
      id: "USER_17",
      pref: [
        "CAFE",
        "PLAT_CHAUD",
        "ACCOMPAGNEMENT",
        "SOUPE"
      ]
    },
    {
      id: "USER_18",
      pref: [
        "CAFE",
        "PLAT_CHAUD",
        "ACCOMPAGNEMENT",
        "SOUPE"
      ]
    },
    {
      id: "USER_19",
      pref: [
        "CAFE",
        "PLAT_CHAUD",
        "ACCOMPAGNEMENT",
        "SOUPE"
      ]
    },
    {
      id: "USER_20",
      pref: [
        "CAFE",
        "PLAT_CHAUD",
        "ACCOMPAGNEMENT",
        "SOUPE"
      ]
    }*/
  ],
  groupes: [
    {
      id: "PLAT_CHAUD",
      min: 8
    },
    {
      id: "CAFE",
      min: 2
    },
    {
      id: "SOUPE",
      min: 2
    },
    {
      id: "ACCOMPAGNEMENT",
      min: 2
    }
  ]
}

let result = data.groupes.map((item) => {return {id: item.id, users: [], min: item.min}});
let totalNumberUsers = data.participants.length;
let totalGroup = data.groupes.map(item => item.min).reduce((prev, next)=> { return prev + next});

shuffleArray(data.participants).forEach(user => {

  let userAssigned = false;
  let offset = 0;

  while (!userAssigned) {

    let assigned = false;
    let currentOffset = offset;

    user.pref.some((prefGroup) => {
      let selectedGroup = result.filter((item) => item.id === prefGroup)[0];

      let selectedGroupOptimumMin = Math.floor(totalNumberUsers * selectedGroup.min / totalGroup);
  
      if(selectedGroup.users.length < selectedGroupOptimumMin + currentOffset) {
        selectedGroup.users.push(user.id);
        assigned = true;
        return true
      } else {
        return false
      }
    });

    userAssigned = assigned;
    offset = currentOffset + 1;
    
  }
  
});

console.log(result);