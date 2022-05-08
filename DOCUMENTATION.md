# API Documentation

<ul>
<li>Responses are successful when they have status code <strong style="color: lightgreen">200.</strong></li>
<li>Reponses other than <strong style="color: lightgreen">200</strong> have a description attached to the error response body.</li>
<li>A response with status code <strong style="color: red">500</strong> is included by default in all responses.</li>
<li>For request that require <strong style="color: white">session_object</strong>, the body data should have properties named as <i style="text-decoration: underline; color: white">session_id</i> and <i style="text-decoration: underline; color: white">session_username</i><ul><li><strong style="color: white">session_id:</strong> the id sent to user when they login</li><li><strong style="color: white">session_username:</strong> username of the request maker</li><li>If the object is not included, the server will respond with <b style="color: red">(401) unauthorized</b></li></ul></li>
<li>Asterisk (<b style="color: #f55">*</b>) denotes a required field in a body.</li>
</ul>

---

## Session

| Login | |
| --- | --- |
| URL | /api/session |
| METHOD | POST |
| BODY | <li>**username:** *string*<b style="color: #f55"> \*</b></li><li>**password:** *string*<b style="color: #f55"> \*</b></li> |
| RESPONSE | <li>200: *{ id, type }*</li><li>403: *incorrect_credentials*</li> |
| DESCRIPTION | Allows user to login to the server and make requests |

| Logout | |
| --- | --- |
| URL | /api/session |
| METHOD | DELETE |
| BODY | <li>**username:** *string*</li><li>**id:** *string*</li> |
| RESPONSE | <li>200: *success*</li> |
| DESCRIPTION | Allows user to logout. |

---

## Stock
<p style="color: dodgerblue">All requests made here require a "session_object"</p>

| Get Stock Items |  |
| --- | --- |
| URL | /api/stock/items |
| METHOD | GET |
| RESPONSE | <li>200: *success* [ stock_item_object ] |
| DESCRIPTION | Returns array of all stock items |

| Create Stock Items |  |
| --- | --- |
| URL | /api/stock/items |
| METHOD | POST |
| BODY | <li>**name:** *string*<b style="color: #f55"> \*</b></li> |
| RESPONSE | <li>200: *success* </li><li>406: *existing_name*</li> |
| DESCRIPTION | Adds an item to stock |

| Input Log | |
| --- | --- |
| URL | /api/stock/items/input-log |
| METHOD | POST |
| BODY | <li>**quantity:** *number*<b style="color: #f55"> \*</b></li><li>**price:** *number*<b style="color: #f55"> \*</b> (price of single unit)</li><li>**name:** *string*<b style="color: #f55"> \*</b></li> |
| RESPONSE | <li>200: *success*</li><li>406: *no_item_found*</li><li>406: *not_enough_body_data*</li> |
| DESCRIPTION | Add an input log to a specific stock item |

| Output Log | |
| --- | --- |
| URL | /api/stock/items/output-log |
| METHOD | POST |
| BODY | <li>**quantity:** *number*<b style="color: #f55"> \*</b></li><li>**name:** *string*<b style="color: #f55"> \*</b></li> |
| RESPONSE | <li>200: *success*</li><li>406: *no_item_found*</li><li>406: *not_enough_body_data*</li> |
| DESCRIPTION | Add an output log to a specific stock item |

| Stock Report | |
| --- | --- |
| URL | /api/stock/report |
| METHOD | GET |
| BODY | <li>**name:** *string* (name of item to filter)</li><li>**type:** *string*('week' or 'month')</li><li>**include:** *string*(no of weeks\month to include)</li><li>**start:** *string*(start date)</li><li>**pdf:** *boolean*</li>

---

## Attendance
<p style="color: dodgerblue">All requests made here require a "session_object"</p>

| Get New Users (waiting-list) | |
| --- | --- |
| URL | /api/attendance/registration/new |
| METHOD | GET |
| RESPONSE | <li>200: *success* [ waiting_list_user_object ] |
| DESCRIPTION | Retrieves all users on <u>waiting list</u> that aren't visited yet. |

| Create New User (waiting-list) | |
| --- | --- |
| URL | /api/attendance/registration/new |
| METHOD | POST |
| BODY | <li>**name:** *String*<b style="color: #f55"> \*</b></li><li>**phone:** *String*</li><li>**sex:** *String*<b style="color: #f55"> \*</b></li><li>**address:** *String*<b style="color: #f55"> \*</b></li><li>**image:** *File (optional)*</li> |
| RESPONSE | <li>200: *success*</li><li>406: *incorrect_sex_parameter*</li><li>406: *image_size_limit_exceeded*</li><li>406: *incorrect_image_format*</li> |
| DESCRIPTION | Creates a new user to the waiting list. |

| Get Visited Users (visited-waiting-list) | |
| --- | --- |
| URL | /api/attendance/registration/visit |
| METHOD | GET |
| RESPONSE | <li>200: *success* [ waiting_list_user_object ] |
| DESCRIPTION | Retrieves all users on <u>waiting list</u> that are visited. |

| Visit Users (waiting-list) | |
| --- | --- |
| URL | /api/attendance/registration/visit |
| METHOD | POST |
| BODY | <li>**id:** *String*<b style="color: #f55"> \*</b></li><li>**birthday:** *Date*</li><li>**maritalStatus:** *String*<b style="color: #f55"> \*</b></li><li>**children:** *Array[{ name, age, schooling }]*</li><li>**spouseName:** *String*</li><li>**jobType:** *String*</li><li>**jobStatus:** *String*<b style="color: #f55"> \*</b></li><li>**rent:** *Number*</li><li>**health:** *String*<b style="color: #f55"> \*</b></li><li>**remark:** *String*</li><li>**recording_1**: *File*</li><li>**recording_2**: *File*</li>
| RESPONSE | <li>200: *success*</li><li>406: *missing_body_data*</li><li>406: *no_user_found*</li><li>406: *audio_size_limit_exceeded*</li><li>406: *incorrect_audio_format*</li> |
| DESCRIPTION | Update a user's status in waiting-list to <b><u>"visited"</u></b> |
| REMARK | To send multiple audio files, say 4 files, use the file name as: <li>recording_1</li><li>recording_2</li><li>recording_3</li><li>recording_4</li> |

| Accept User (waiting-list) | |
| --- | --- |
| URL | /api/attendance/registration/accept |
| METHOD | POST |
| BODY | <li>**id:** *String*<b style="color: #f55"> \*</b></li>|
| RESPONSE | <li>200: *success*</li><li>406: *no_user_found*</li> |
| DESCRIPTION | Accept user in waiting-list to the attendance list. |

| Old Member Registration | |
| --- | --- |
| URL | /api/attendance/client/old-timer |
| METHOD | POST |
| BODY | <li>**name:** *String*<b style="color: #f55"> \*</b></li><li>**phone:** *String*</li><li>**sex:** *String*<b style="color: #f55"> \*</b></li><li>**address:** *String*<b style="color: #f55"> \*</b></li><li>**image:** *File (optional)*</li><li>**birthday:** *Date*</li><li>**maritalStatus:** *String*<b style="color: #f55"> \*</b></li><li>**children:** *Array[{ name, age, schooling }]*</li><li>**spouseName:** *String*</li><li>**jobType:** *String*</li><li>**jobStatus:** *String*<b style="color: #f55"> \*</b></li><li>**rent:** *Number*</li><li>**health:** *String*<b style="color: #f55"> \*</b></li><li>**remark:** *String*</li> |
| RESPONSE | <li>200: *success*</li><li>406: *missing_body_data*</li><li>406: *image_size_limit_exceeded*</li><li>406: *incorrect_image_format*</li> |
| DESCRIPTION | Register old member directly to the attendance list |


| Get Users (attendance-list) | |
| --- | --- |
| URL | /api/attendance/client |
| METHOD | GET |
| RESPONSE | <li>200: *success* [ attendance_list_user_object ]</li> |
| DESCRIPTION | Returns users in the attendance list |

| Check attendance | |
| --- | --- |
| URL | /api/attendance/client/attendance/check |
| METHOD | POST |
| BODY | <li>**id:** *string*<b style="color: #f55"> \*</b></li><li>**present:** *boolean*</li><li>**permission:** *boolean*</li><li>**detail:** *string*</li> |
| RESPONSE | <li>200: *success*</li> |
| DESCRIPTION | Checks a certain person's attendance for the day |