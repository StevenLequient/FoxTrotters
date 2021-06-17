#include "app_main.h"
#include "uib_app_manager.h"
#include "uib_views.h"
#include "uib_views_inc.h"



/* app event callbacks */
static bool _on_create_cb(void *user_data);
static void _on_terminate_cb(void *user_data);
static void _on_app_control_cb(app_control_h app_control, void *user_data);
static void _on_resume_cb(void *user_data);
static void _on_pause_cb(void *user_data);
static void _on_low_memory_cb(app_event_info_h event_info, void *user_data);
static void _on_low_battery_cb(app_event_info_h event_info, void *user_data);
static void _on_device_orientation_cb(app_event_info_h event_info, void *user_data);
static void _on_language_changed_cb(app_event_info_h event_info, void *user_data);
static void _on_region_format_changed_cb(app_event_info_h event_info, void *user_data);

void
nf_hw_back_cb(void* param, Evas_Object * evas_obj, void* event_info) {
	//TODO : user define code
	evas_obj = uib_views_get_instance()->get_window_obj()->app_naviframe;
	elm_naviframe_item_pop(evas_obj);
}

void
win_del_request_cb(void *data, Evas_Object *obj, void *event_info)
{
	ui_app_exit();
}

Eina_Bool
nf_root_it_pop_cb(void* elm_win, Elm_Object_Item *it) {
	elm_win_lower(elm_win);
	return EINA_FALSE;
}

app_data *uib_app_create()
{
	return calloc(1, sizeof(app_data));
}

void uib_app_destroy(app_data *user_data)
{
	uib_app_manager_get_instance()->free_all_view_context();
	free(user_data);
}



void
bt_data_received_cb(bt_socket_received_data_s* data, void* user_data)
{
	 uib_app_manager_st* app_manager = uib_app_manager_get_instance();
	            uib_view1_view_context* view1 =  app_manager->find_view_context("view1");
	            elm_object_text_set(view1->label2,"chibre");
    if (data == NULL) {
        dlog_print(DLOG_INFO, LOG_TAG, "No received data!");
        snprintf("checked",7,NULL);


        return ;
    }
    dlog_print(DLOG_INFO, LOG_TAG, "Socket fd: %d", data->socket_fd);
    dlog_print(DLOG_INFO, LOG_TAG, "Data: %s", data->data);
    dlog_print(DLOG_INFO, LOG_TAG, "Size: %d", data->data_size);
    /*uib_app_manager_st* app_manager = uib_app_manager_get_instance();
    uib_view1_view_context* view1 =  app_manager->find_view_context("view1");*/
    elm_object_text_set(view1->label2,data->data);

}






void
bluetooth_thread(void *data, Ecore_Thread *thread)
{
	bt_error_e ret;
	//bt_socket_data_received_cb test;

	while(true){
		sleep(2);

		//C'EST ICI QUE LE CALLBACK PART PAS
		ret = bt_socket_set_data_received_cb((bt_socket_data_received_cb) bt_data_received_cb, data);
		if (ret != BT_ERROR_NONE)
		{
		   dlog_print(DLOG_ERROR, LOG_TAG, "[bt_socket_data_received_cb] regist to fail.");
		}
	    dlog_print(DLOG_INFO, LOG_TAG, "ret : %d", ret);


	}
	/*while(true){
		usleep(2000000);
    uib_app_manager_st* app_manager = uib_app_manager_get_instance();
    	uib_view1_view_context* view1 =  app_manager->find_view_context("view1");
    	elm_object_text_set(view1->label2,"nope");
	}*/
}



void
my_feedback_job_notify(void *data, Ecore_Thread *thread, void *msg)
{
    struct feedback_msg *message = msg;
    free(message);
}

void
my_job_end(void *data, Ecore_Thread *thread)
{
    dlog_print(DLOG_INFO, LOG_TAG, "Thread has normally ended.\n");
}

void
my_job_cancel(void *data, Ecore_Thread *thread)
{
    dlog_print(DLOG_INFO, LOG_TAG, "Thread has been cancelled.\n");
}




int uib_app_run(app_data *user_data, int argc, char **argv)
{
	ui_app_lifecycle_callback_s cbs =
	{
		.create = _on_create_cb,
		.terminate = _on_terminate_cb,
		.pause = _on_pause_cb,
		.resume = _on_resume_cb,
		.app_control = _on_app_control_cb,
	};

	app_event_handler_h handlers[5] =
	{NULL, };

	ui_app_add_event_handler(&handlers[APP_EVENT_LOW_BATTERY], APP_EVENT_LOW_BATTERY, _on_low_battery_cb, user_data);
	ui_app_add_event_handler(&handlers[APP_EVENT_LOW_MEMORY], APP_EVENT_LOW_MEMORY, _on_low_memory_cb, user_data);
	ui_app_add_event_handler(&handlers[APP_EVENT_DEVICE_ORIENTATION_CHANGED], APP_EVENT_DEVICE_ORIENTATION_CHANGED, _on_device_orientation_cb, user_data);
	ui_app_add_event_handler(&handlers[APP_EVENT_LANGUAGE_CHANGED], APP_EVENT_LANGUAGE_CHANGED, _on_language_changed_cb, user_data);
	ui_app_add_event_handler(&handlers[APP_EVENT_REGION_FORMAT_CHANGED], APP_EVENT_REGION_FORMAT_CHANGED, _on_region_format_changed_cb, user_data);
	bt_initialize();


	return ui_app_main(argc, argv, &cbs, user_data);
}



void
app_get_resource(const char *res_file_in, char *res_path_out, int res_path_max)
{
	char *res_path = app_get_resource_path();
	if (res_path) {
		snprintf(res_path_out, res_path_max, "%s%s", res_path, res_file_in);
		free(res_path);
	}
}

void
server (){
	return;
}

static bool _on_create_cb(void *user_data)
{
	/*
	 * This area will be auto-generated when you add or delete user_view
	 * Please do not hand edit this area. The code may be lost.
	 */
	uib_app_manager_st* app_manager = uib_app_manager_get_instance();
	app_manager->initialize();
	/*
	 * End of area
	 */

	bt_error_e ret;


	ret = bt_initialize();
		    dlog_print(DLOG_INFO, LOG_TAG, "bt_initialize: %d", ret);
		    if (ret != BT_ERROR_NONE)
		    {
		       dlog_print(DLOG_ERROR, LOG_TAG, "[bt_initialize] Failed.");


		    }

		    ret = bt_socket_set_connection_state_changed_cb(server, NULL);
		    if (ret != BT_ERROR_NONE) {
		        dlog_print(DLOG_ERROR, LOG_TAG, "[bt_socket_set_connection_state_changed_cb] failed.");


		    }

		    /*const char *service_uuid="00001101-0000-1000-8000-00805F9B34FB";

		    ret = bt_socket_connect_rfcomm(bt_server_address, service_uuid);
		    if (ret != BT_ERROR_NONE) {
		        dlog_print(DLOG_ERROR, LOG_TAG, "[bt_socket_connect_rfcomm] failed.");


		    } else {
		        dlog_print(DLOG_INFO, LOG_TAG, "[bt_socket_connect_rfcomm] Succeeded. bt_socket_connection_state_changed_cb will be called.");
		    }*/
	//user_data->am = app_manager;
	//app_manager->find_view_context("view1");


	return true;
}

static void _on_terminate_cb(void *user_data)
{
	uib_views_get_instance()->destroy_window_obj();
}

static void _on_resume_cb(void *user_data)
{
	/* Take necessary actions when application becomes visible. */
}

static void _on_pause_cb(void *user_data)
{
	/* Take necessary actions when application becomes invisible. */
}

static void _on_app_control_cb(app_control_h app_control, void *user_data)
{
	/* Handle the launch request. */
	uib_app_manager_st* app_manager = uib_app_manager_get_instance();
	uib_view1_view_context* view1 =  app_manager->find_view_context("view1");
	elm_object_text_set(view1->label2,"nope");
	ecore_thread_run(bluetooth_thread, my_job_end, my_job_cancel, user_data);


}

static void _on_low_memory_cb(app_event_info_h event_info, void *user_data)
{
	/* Take necessary actions when the system runs low on memory. */
}

static void _on_low_battery_cb(app_event_info_h event_info, void *user_data)
{
	/* Take necessary actions when the battery is low. */
}

static void _on_device_orientation_cb(app_event_info_h event_info, void *user_data)
{
	/* deprecated APIs */
}

static void _on_language_changed_cb(app_event_info_h event_info, void *user_data)
{
	/* Take necessary actions is called when language setting changes. */
	uib_views_get_instance()->uib_views_current_view_redraw();
}

static void _on_region_format_changed_cb(app_event_info_h event_info, void *user_data)
{
	/* Take necessary actions when region format setting changes. */
}



