#!/usr/bin/awk -f

# Set field separator as comma for csv and print the HTML header line
BEGIN {
    FS="|";
    print "<table style=\"border-collapse: collapse; border: 1px solid black; padding: 15px;\"><tr> <th>Title</th> <th>Date</th> <th>xPub Id</th> <th>eJP Id</th> <th>Author</th> </tr>"
}
# Function to print a row with one argument to handle either a 'th' tag or 'td' tag
function printRow(tag) {
    print "<tr>";
    for(i=1; i<=NF; i++) print "<"tag">"$i"</"tag">";
    print "</tr>"
}
# If CSV file line number (NR variable) is greater than 1, call printRow fucntion with 'td' as argument
NR>0 {
    printRow("td  style=\"border: 1px solid black; padding: 8px\"")
}
# Print HTML footer
END {
    print "</table>"
}
