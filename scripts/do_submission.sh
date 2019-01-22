#!/bin/bash
#################################################################################
# Script is designed to be run:
# - With a screen resolusion: 1920 x 1080
# - With google chrome set to half the width of the screen and positioned on
#   the RHS of your screen.
#################################################################################
set -e

WID=$(xdotool search --all --onlyvisible --desktop 1 --class "google-chrome")
CMD="xdotool windowactivate --sync ${WID}"
WAIT=0.5

$CMD key F5
sleep 3
$CMD key --repeat 7 Tab
sleep $WAIT
$CMD key space
# $CMD mousemove 1816 324 click 1

echo Author #####################
sleep $WAIT
$CMD mousemove 1046 541 click 1
sleep $WAIT
$CMD mousemove 1044 869 click 1
sleep $WAIT

echo Files #####################
$CMD mousemove 1106 607 click 1
$CMD type "Please accept my submission"
$CMD key Tab
$CMD key space
sleep $WAIT

echo Manuscript upload ....
WID_DIALOG=$(xdotool search --name "Open Files")
CMD_DIALOG="xdotool windowactivate --sync ${WID_DIALOG}"
$CMD_DIALOG key ctrl+l
sleep $WAIT
$CMD_DIALOG type "~/Documents/Manuscripts/Test Manuscript.pdf"
$CMD_DIALOG key Return
echo Waiting for upload....
sleep 4
echo Done waiting!

$CMD key --repeat 3 Tab
$CMD key space
sleep $WAIT

echo Supporting files...
WID_DIALOG=$(xdotool search --name "Open Files")
CMD_DIALOG="xdotool windowactivate --sync ${WID_DIALOG}"
$CMD_DIALOG key ctrl+l
sleep $WAIT
$CMD_DIALOG type "~/Pictures/dancing-banana.gif"
$CMD_DIALOG key Return
sleep 3

$CMD key --repeat 2 Tab
$CMD key space
sleep $WAIT

echo Submission #####################
$CMD key Tab
$CMD type "Automated test by Peter $(date)"

$CMD key Tab
$CMD key space
sleep $WAIT
$CMD mousemove 1063 620 click 1 # Select Article Type
sleep $WAIT
$CMD key Tab space Return
sleep $WAIT
$CMD key --repeat 5 Tab
$CMD key space
sleep $WAIT

echo Editors ####################

$CMD key Tab
$CMD key space
sleep $WAIT

echo Suggest Senior Editors
sleep 1
$CMD key --repeat 5 Tab
$CMD key space
sleep $WAIT
$CMD key --repeat 3 Tab
$CMD key space
sleep $WAIT
$CMD mousemove 1200 1013 click 1
sleep 2

$CMD key --repeat 2 Tab
$CMD key space
sleep $WAIT

echo Suggest Reviewing Editors
sleep 5 # There are lots so wait for the spinner
$CMD key --repeat 5 Tab
sleep $WAIT
$CMD key space

sleep 1
$CMD key --repeat 3 Tab
sleep $WAIT
$CMD key space
sleep 1
echo CLICK!
$CMD mousemove 1200 1013 click 1
sleep 8 # Can take a time to add

$CMD key --repeat 6 Tab
$CMD key space

echo Disclosure ####################

sleep 1
$CMD key --repeat 3 Tab
$CMD type "Peter from eLife"

$CMD mousemove 996 877 click 1

$CMD key --repeat 2 Tab
$CMD key space
sleep $WAIT

echo Confirm Submission
$CMD key --repeat 2 Tab
$CMD key space
sleep $WAIT

echo Thankyou confirmation
sleep 1
$CMD key --repeat 2 Tab
$CMD key space
sleep $WAIT

echo DONE ###############################
