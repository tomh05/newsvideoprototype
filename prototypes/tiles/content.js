var title = "Malaysia jet crashes in east Ukraine conflict zone";

// layout maps row and column to tile IDs - so layout[row][col] finds the current tile
var layout = [[1],[3,8,9],[4,5],[6,7]];

// parent, child and level are unused in this example. Body is just an html string.
var atoms = [
    {"id":"1", "level":"2", "parent":"","child":"", "body":"A Malaysia Airlines jet carrying 295 people has crashed in east Ukraine on a flight from Amsterdam to Kuala Lumpur."},
    {"id":"2", "level":"2", "parent":"","child":"", "body":"There are no signs of survivors at the scene of the crash near the village of Grabovo, in rebel-held territory close to the border with Russia."},
    {"id":"3", "level":"2", "parent":"10","child":"", "body":"Both sides in Ukraine's <a href='civil'> civil conflict</a> accused each other of shooting down the plane with a missile. It is still not clear why the plane came down."},
    {"id":"4", "level":"2", "parent":"","child":"11", "body":"The plane fell between Krasni Luch in <a href='region'>Luhansk region</a> and Shakhtarsk in the neighbouring region of Donetsk."},
    {"id":"5", "level":"2", "parent":"","child":"", "body":"The crash site is in an area controlled by Ukraine's separatist rebels."},
    {"id":"6", "level":"2", "parent":"","child":"12", "body":"At least <a href='passengers'>100 bodies</a> have been found so far at the scene, an emergency services worker told Reuters news agency"},
    {"id":"7", "level":"2", "parent":"","child":"", "body":"with wreckage spread across an area of up to about 15km (nine miles) in diameter."},
    {"id":"8", "level":"2", "parent":"","child":"13", "body":"US and Ukrainian officials said they believed the plane had been <a href='missile'>brought down by a missile</a>."},
    {"id":"9", "level":"2", "parent":"","child":"", "body":"Ukrainian President Petro Poroshenko said it was an 'act of terrorism'."},
    {"id":"10", "level":"3", "parent":"3","child":"", "body":"<h2>Civil Conflict</h2><p>The crisis in Ukraine began in November last year when pro-Moscow President Viktor Yanukovych abandoned a deal with the EU in favour of stronger ties with Russia.</p><p> Protests erupted in the capital Kiev and quickly escalated as government buildings were seized in cities across the western regions of Ukraine.</p>"},
    {"id":"11", "level":"3", "parent":"4","child":"", "body":"<h2>Crash Site Location</h2><img src='http://news.bbcimg.co.uk/media/images/76339000/gif/_76339189_ukraine_malaysia_plane_976_latest.gif' width='250' height='180' />"},
    {"id":"12", "level":"3", "parent":"","child":"6", "body":"<h2>Passengers</h2> <p>At a news conference at Schiphol airport, Malaysia Airlines' European chief Huib Gorter said they were still trying to identify some of the passengers from flight MH17. <p>He said of the passengers that have been identified there were:</p> <ul><li>154 Dutch nationals</li><li>27 Australians</li><li> 23 Malaysians</li><li> 11 Indonesians</li><li> Six Britons</li><li> four Germans</li><li> four Belgians</li><li> three from the Philippines</li><li>one Canadian.</ul><p>All 15 of the crew were Malaysian.</p>"},
    {"id":"13", "level":"3", "parent":"8","child":"", "body":"<h2>Analysis: Jonathan Marcus, BBC News</h2> <p>If it does turn out that the Boeing 777 was shot down by the separatists - with weaponry supplied by Moscow - then it could significantly alter the terms of the whole debate surrounding the Ukraine crisis.</p><p>Over the past few days there has been growing concern among Western governments that <p>Russia was stepping up its military support for the separatists in eastern Ukraine.</p><p>Nato spokesmen insist that more and more heavy military equipment has moved from Russian stockpiles to the separatists across the border.</p>"},
]
