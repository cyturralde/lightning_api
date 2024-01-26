# lightning_api


*WARNING -- DO NOT RUN THE STATUS UPDATE AUTOMATICALLY MORE THAN ONCE AN HOUR. THERE HAVE BEEN REPORTS OF ACCOUNTS BEING LOCKED DUE TO FREQUENCY OF USE*


The steps to this are a little confusing at first but I will do my best.

1. Create an account on https://developer.ford.com
2. Once you have an account go here : https://developer.ford.com/apis/fordconnect/documentation and download the guide and the postman files.
3. Create an account on postman.com and then follow the instructions in the guide including uploading all the files to postman.
4. Once you have create tokens in postman create a refresh token in postman twice.
6. In your mysql db put your client_id, client_secret,and the last refresh token you created in the database.
7. Get your vehicle_id from the postmant commands.
8. In the php files update the top section with your mysql db information and the vehicle_id variable with your vehicle id
9. Now when you run these scripts they should automatically update the db with a new refresh token so that it should not expire if you run it atleast once a month.
10. the scriptable app you should be able to paste into scriptable and run. You will have to find your own truck image and icons to use, but once you do just upload them to the scriptable folder.


Shortcuts Automation

1. Every hour I have it run a shortcut called truck status. All this shortcut does is get the contents of the url (wherever you are hosting your php files), get text from the contents, get dictionary from text, then save the dictionary to a file (which is called "truck_data.json") located in the scriptable folder. Then for the last step I have it run the scriptable script that was created which will refresh the widget.

2. The above can be repeated for the lock command but instead of every hour I have it automate when I disconnect from carplay and then wait 20 seconds so I know I am out of the car. otherwise the rest of the steps are the same.
