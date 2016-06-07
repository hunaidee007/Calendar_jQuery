$.fn.createCalendar = function(jsonData, currentDateString) {

	if ($.isEmptyObject(currentDateString)) {
		currentDate = moment();

	} else {
		currentDate = moment(currentDateString, "DD-MM-YYYY")
	}

	createCalendar(currentDate, jsonData);

};

function prev() {
	$(".calendar").empty()
	currentDate = currentDate.subtract(1, 'months');
	if (typeof beforePrev !== 'undefined' && $.isFunction(beforePrev)) {
		beforePrev(currentDate);
	}

	createCalendar(currentDate, jsonData);
}

function next() {
	$(".calendar").empty()
	currentDate = currentDate.add(1, 'months');

	if (typeof beforeNext !== 'undefined' && $.isFunction(beforeNext)) {
		beforeNext(currentDate);
	}
	createCalendar(currentDate, jsonData);
}

function createCalendar(currentDate, jsonData) {
	//fetch todays date
	var todaysDate = moment()
	
	//Create Navigation pannel
	var navigationDiv = '<tr style="border:1px solid #ccc;background-color:#FBFBFB"><td class="nav" colspan="2"><i class="fa fa-2x fa-arrow-circle-left" onclick="prev()"></i></td><td style="text-align:center;font-size: 20px;" class="nav" colspan="3">'
			+ currentDate.format('MMMM YYYY')
			+ '</td><td style="text-align:right"  class="nav" colspan="2"><i class="fa fa-2x fa-arrow-circle-right" onclick="next();"></i></td></tr>';

	//Add 1 to passed Month (Month count from 0 to 11)
	var currentMonth = currentDate.month() + 1
	
	//Create String with 1st date of the month ('01-05-2015')
	var firstDate = "01-" + currentMonth + "-" + currentDate.year();

	//Find out the day of the first date(Mon -0, Tue -1)
	var firstDayOfTheMonth = moment(firstDate, "DD-MM-YYYY").day() + 1;
	
	//Subtract those many days from first day of current mpnth. This is to start from Sunday.
	currentDate = moment(firstDate, "DD-MM-YYYY").subtract(firstDayOfTheMonth,'days');
	
	
	var tableElement = '<div class="fullcalendar">' 
			+ '<table class="calendarTable">'+ navigationDiv;

	//Create Header of Table
	tableElement = tableElement
			+ '<tr><td class="day size">SUN</td><td class="day size">MON</td><td class="day size">TUE</td><td class="day size">WED</td><td class="day size">THU</td><td class="day size">FRI</td><td class="day size">SAT</td></tr>'
	tableElement = tableElement + '<tr>'
	for (i = 1; i <= 42; i++) {
		//Increment each day
		currentDate = currentDate.add(1, 'days')
		
		varTdId = currentDate.format('DD-MM-YYYY')
		
		var foundElement = null;
		var trClass = 'size ';
		// Iterate thorugh JSONdata to find the element.
		if (jsonData != null) {
			$.each(jsonData.jsondata, function(index, element) {
				if (varTdId == element.date) {
					foundElement = element
					if (foundElement.hasOwnProperty('datetype')) {
						trClass = trClass + foundElement.datetype;
					}					
				}
			});
		}

		//If date is not of current month, add fadeDay class
		if (currentMonth != currentDate.month() + 1) {
			console.log(trClass)
			trClass = trClass + ' fadeDay'
		}
		var dayDivClass = "dayDiv";
		var todaysDateFormat = todaysDate.format('DD-MM-YYYY')
		//If date is todays date add todaysDate class
		if (todaysDateFormat == varTdId) {
			dayDivClass = dayDivClass + " todaysDate";
		}
		//Add Date on div
		tableElement = tableElement + '<td  id="' + varTdId + '" ><div class="dateDiv '+trClass+'" id="' + varTdId + '"><div class="' + dayDivClass
				+ '" >' + currentDate.date() + '</div>';

		//Add icons
		if (foundElement != null) {
			console.log(foundElement.hasOwnProperty('iconslist'))
			if (foundElement.hasOwnProperty('iconslist')) {
				console.log('checked foundelement.iconslist')

				var iconsArray = foundElement.iconslist.split(',');
				for (var j = 0; j < iconsArray.length; j++) {
					tableElement = tableElement + '<div class="absolute '
							+ iconsArray[j] + '"><img class="' + iconsArray[j]
							+ '" /></div>'
				}
			}
			//Add events
			if (foundElement.hasOwnProperty('events')) {
				$.each(foundElement.events, function(index, event) {
					// console.log(event.eventtype)
					tableElement = tableElement + '<div  class="event '
							+ event.eventtype + 'event" title="'
							+ event.eventtext + '"></div>'
				});
			}
		}
		tableElement = tableElement + '</div ></td>';
		if (i % 7 == 0) {
			tableElement = tableElement + '</tr><tr>';
		}

	}

	tableElement = tableElement + '</table> <a style="color:white" href="#">www.java-redefined.com</a></div>';

	// Add created table to main div
	$(".calendar").append(tableElement);
	
	//Iterate thorugh all td and apply click event
	$('.dateDiv').each(
			function() {

				var id = $(this).attr("id");
				$(this).bind(
						"click",
						function() {

							if (typeof dayClickedEvent !== 'undefined'
									&& $.isFunction(dayClickedEvent)) {
								dayClickedEvent(id);
							}
						});
			});
			
	$('.event').each(
	
			function() {

				var id = $(this).parent().attr("id");
				$(this).bind(
						"click",
						function(event) {

							if (typeof eventClickedEvent !== 'undefined'
									&& $.isFunction(eventClickedEvent)) {
								eventClickedEvent(id);
							}
							return false;
						});
			});

}
