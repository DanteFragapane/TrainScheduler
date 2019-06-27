const config = {
  apiKey: 'AIzaSyC9QTg5QHJNlAfDlrF838MLEM4AYKY8LuU',
  authDomain: 'fir-click-counter-7cdb9.firebaseapp.com',
  databaseURL: 'https://trainscheduler-27475.firebaseio.com/',
  projectId: 'classexample-eb713',
  storageBucket: 'fir-click-counter-7cdb9.appspot.com'
}
firebase.initializeApp(config)
const database = firebase.database()

// Get the next arrival of the train
const nextArrival = function nextArrival (time, frequency) {
  const timeConverted = moment(time, 'hh:mm').subtract(1, 'days')
  const difference = moment().diff(moment(timeConverted), 'minutes')
  const remainder = difference % frequency
  const minTillTrain = frequency - remainder
  const next = moment().add(minTillTrain, 'minutes')
  return moment(next).format('HH:mm')
}

// Create the row for the table
const createRow = function createRow (name, destination, time, frequency) {
  const row = $('<tr>')
  const next = nextArrival(time, frequency)
  const minAway = moment(next, 'HH:mm').diff(moment(new Date(), 'HH:mm'), 'minutes')
  console.log(next)
  console.log(minAway)

  row.append($('<th>', {
    scope: 'row',
    text: name
  }))
  row.append($('<td>', {
    text: destination
  }))
  row.append($('<td>', {
    text: frequency
  }))
  row.append($('<td>', {
    text: next
  }))
  row.append($('<td>', {
    text: minAway
  }))
  return row
}

$('#addTrain').on('submit', (event) => {
  event.preventDefault()

  const name = $('#name').val()
  const destination = $('#destination').val()
  const time = $('#time').val()
  const frequency = $('#frequency').val()
  database.ref().push({
    'name': name,
    'destination': destination,
    'time': time,
    'frequency': frequency
  })
})

// Initial call to database to populate the table
database.ref().on('value', (snapshot) => {
  const data = snapshot.val()

  if (data !== null) {
    const entries = Object.entries(data)
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i][1]
      $('tbody').append(createRow(entry.name, entry.destination, entry.time, entry.frequency))
    }
  }
})
