<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Account extends CI_Controller {
    /*
      Home Root controller
     */

    function __construct() {
        parent::__construct();
        $this->load->model('user/Account_model');
        $this->load->helper('security');
        $this->load->helper('url');
        $this->load->helper('form');
        $this->load->library('form_validation');
        $this->load->library('email');
        $this->load->helper('site');
        $this->user = $this->session->userdata('Front_userId');
        if (!is_front_user($this->user)) {
            redirect('auth/login');
        }
        if ($this->session->userdata('Front_Acc_type') != 'consumer') {
            redirect('funeral/account');
        }
    }

    protected $validation_rules = array(
        'valid_account_edit' => array(
            array(
                'field' => 'full_name',
                'label' => 'Contact Name',
                'rules' => 'trim|required|max_length[100]|min_length[3]|xss_clean'
            ),
            array(
                'field' => 'phone_no',
                'label' => 'Phone Number',
                'rules' => 'trim|required|max_length[15]|min_length[10]|xss_clean'
            ),
            array(
                'field' => 'shipping_address',
                'label' => 'Adress',
                'rules' => 'trim|required|xss_clean'
            ),
            array(
                'field' => 'city',
                'label' => 'City',
                'rules' => 'trim|required|xss_clean'
            ),
            array(
                'field' => 'state',
                'label' => 'State',
                'rules' => 'trim|required|xss_clean'
            ),
            array(
                'field' => 'zip',
                'label' => 'Zip',
                'rules' => 'trim|required|xss_clean'
            ),
            array(
                'field' => 'country',
                'label' => 'Country',
                'rules' => 'trim|required|xss_clean'
            ),
            array(
                'field' => 'password',
                'label' => 'Password',
                'rules' => 'trim|min_length[7]|max_length[20]|callback_valid_check_password[password]|xss_clean'
            )
        ),
        'valid_order_add' => array(
            array(
                'field' => 'price',
                'label' => 'Price Package',
                'rules' => 'trim|required|xss_clean'
            ),
            array(
                'field' => 'subject_name',
                'label' => 'Subject Name',
                'rules' => 'trim|required|xss_clean'
            ),
            array(
                'field' => 'due_date',
                'label' => 'Due Date',
                'rules' => 'trim|required|xss_clean'
            ),
            array(
                'field' => 'due_date',
                'label' => 'Due Date',
                'rules' => 'trim|required|xss_clean'
            ),
            array(
                'field' => 'number_of_pic',
                'label' => 'Number of Photos',
                'rules' => 'trim|required|xss_clean'
            ),
        )
    );

    public function index() {
        $data = array();
        $result = $this->Account_model->get_user_order($this->user);
        $data['orderdata'] = $result;
        $view = 'user/consumer-pending-orders';
        user_view_loader($view, $data);
    }

    public function consumer_complete_order() {
        $this->load->library('pagination');
        $contact_deleted = 0;
        $uri_segment = 4;
        // return third URI segment, if no third segment returns '' 
        $offset = $this->uri->segment($uri_segment, '');
        // assign posted valued
        $data['project_name'] = $this->input->get('project_name');
        // gets total URI segments
        $total_seg = $this->uri->total_segments();
        // set search params
        // enters here only when 'Search' button is pressed or through 'Paging'

        if (isset($_GET['search']) || isset($_GET['project_name']) || isset($_GET['project_status']) || $total_seg > 4) {

            $default = array('project_name', 'project_status');
            //$uri_segment=8;
            $uri_segment = 6;
            $offset = $this->uri->segment($uri_segment, '');
            if (!ctype_digit($offset)) {
                $uri_segment = 8;
                $offset = $this->uri->segment($uri_segment, '');
            }
            if ($total_seg > 4) {
                // navigation from paging									

                /**
                 *
                 * Convert URI segments into an associative array of key/value pairs
                 * But this array also contains the last redundant key value pair taking the page number as key.
                 * So, the last key value pair must be removed.				 
                 *
                 */
                $this->terms = $this->uri->uri_to_assoc(4, $default);
                $this->terms = array_filter($this->terms);
                // print_r($this->terms);
                // die();
                /**
                 * Replacing all the 'unset' values in the associative array (with keys as in $default array) to null value
                 * and create a new array '$this->terms_uri' taking only the database keys we need to query, 				
                 * */
                for ($i = 0; $i < count($default); $i++) {
                    if (isset($this->terms[$default[$i]])) {
                        $this->terms_uri[$default[$i]] = $this->terms[$default[$i]];
                    }
                }

                //$this->terms_uri['name'] = $this->terms['name'];		
                // When the page is navigated through paging, it enters the condition below

                if (($total_seg % 2) > 0) {
                    // exclude the last array item (i.e. the array key for page number), prepare array for database query
                    $this->terms = array_slice($this->terms, 0, (floor($total_seg / 2) - 1));
                    $offset = $this->uri->segment($total_seg, '');
                    $uri_segment = $total_seg;
                }
                foreach ($this->terms as $key => $val) {
                    $contnt = urldecode($val);
                    $contnt = trim($contnt);
                    $this->terms[$key] = $contnt;
                }
                // Convert associative array $this->terms_uri to segments to append to base_url
                $keys = $this->uri->assoc_to_uri($this->terms_uri);
                $orderby = array();
                if (isset($_GET['orderby'])) {

                    if ($_GET['orderby'] == "order_no")
                        $_GET['orderby'] = 'order_no';
                    if ($_GET['orderby'] == "usertype")
                        $_GET['orderby'] = 'usertype';
                    if ($_GET['orderby'] == "subject_name")
                        $_GET['orderby'] = 'subject_name';
                    if ($_GET['orderby'] == "number_of_pic")
                        $_GET['orderby'] = 'number_of_pic';
                    if ($_GET['orderby'] == "due_date")
                        $_GET['orderby'] = 'due_date';
                    if ($_GET['orderby'] == "admin_name")
                        $_GET['orderby'] = 'admin_name';
                    if ($_GET['orderby'] == "order_status")
                        $_GET['orderby'] = 'order_status';

                    $orderby['order'] = $_GET['order'];
                    $orderby['orderby'] = $_GET['orderby'];
                }
                if (!ctype_digit($offset)) {
                    $offset = 0;
                }
                if (isset($this->terms['project_name']) && $this->terms['project_name'] != '') {
                    $this->terms['project_status'] = $this->terms['project_name'];
                    $projects_name = $this->terms['project_name'];
                }

                $parents = $this->Account_model->pending_get_search_pagedlist($this->terms, $this->limit, $offset, $orderby, $this->user)->result();
                //echo $this->db->last_query(); 
                //die ;
                if (isset($_GET['orderby'])) {

                    if ($_GET['orderby'] == "order_no")
                        $_GET['orderby'] = 'order_no';
                    if ($_GET['orderby'] == "usertype")
                        $_GET['orderby'] = 'usertype';
                    if ($_GET['orderby'] == "subject_name")
                        $_GET['orderby'] = 'subject_name';
                    if ($_GET['orderby'] == "number_of_pic")
                        $_GET['orderby'] = 'number_of_pic';
                    if ($_GET['orderby'] == "due_date")
                        $_GET['orderby'] = 'due_date';
                    if ($_GET['orderby'] == "admin_name")
                        $_GET['orderby'] = 'admin_name';
                    if ($_GET['orderby'] == "order_status")
                        $_GET['orderby'] = 'order_status';
                }
                // set total_rows config data for pagination			
                $config['total_rows'] = $this->Account_model->pending_count_all_search($this->terms, $this->user);
                $this->terms = array();        // resetting terms array
                $this->terms_uri = array();       // resetting terms_uri array
            }else {
                // navigation through POST search button

                $searchparams_uri = array();

                for ($i = 0; $i < count($default); $i++) {
                    if ($this->input->get($default[$i]) != '') {
                        $searchparams_uri[$default[$i]] = $this->input->get($default[$i]);
                        $data[$default[$i]] = $this->input->get($default[$i]);
                    } else {
                        //$searchparams_uri[$default[$i]] = 'unset';
                        //$data[$default[$i]] = '';						
                    }
                }
                foreach ($searchparams_uri as $k => $v) {
                    if ($v != 'unset') {
                        $v = urldecode($v);
                        $v = trim($v);
                        $searchparams[$k] = $v;
                    } else {
                        $searchparams[$k] = '';
                    }
                }
                $orderby = array();
                if (isset($_GET['orderby'])) {
                    if ($_GET['orderby'] == "order_no")
                        $_GET['orderby'] = 'order_no';
                    if ($_GET['orderby'] == "usertype")
                        $_GET['orderby'] = 'usertype';
                    if ($_GET['orderby'] == "subject_name")
                        $_GET['orderby'] = 'subject_name';
                    if ($_GET['orderby'] == "number_of_pic")
                        $_GET['orderby'] = 'number_of_pic';
                    if ($_GET['orderby'] == "due_date")
                        $_GET['orderby'] = 'due_date';
                    if ($_GET['orderby'] == "admin_name")
                        $_GET['orderby'] = 'admin_name';
                    if ($_GET['orderby'] == "order_status")
                        $_GET['orderby'] = 'order_status';


                    $orderby['order'] = $_GET['order'];
                    $orderby['orderby'] = $_GET['orderby'];
                }

                if (isset($searchparams['project_name']) && $searchparams['project_name'] != '') {
                    $searchparams['project_name'] = $searchparams['project_name'];
                    $searchparams['project_status'] = $searchparams['project_name'];
                    $projects_name = $searchparams['project_name'];
                }
                $offset = 0;
                if (empty($searchparams)) {
                    $searchparams = array();
                }
                $parents = $this->Account_model->pending_get_search_pagedlist($searchparams, $this->limit, $offset, $orderby)->result();
                //echo $this->db->last_query();
                //die;
                if (isset($_GET['orderby'])) {
                    if ($_GET['orderby'] == "order_no")
                        $_GET['orderby'] = 'order_no';
                    if ($_GET['orderby'] == "usertype")
                        $_GET['orderby'] = 'usertype';
                    if ($_GET['orderby'] == "subject_name")
                        $_GET['orderby'] = 'subject_name';
                    if ($_GET['orderby'] == "number_of_pic")
                        $_GET['orderby'] = 'number_of_pic';
                    if ($_GET['orderby'] == "due_date")
                        $_GET['orderby'] = 'due_date';
                    if ($_GET['orderby'] == "admin_name")
                        $_GET['orderby'] = 'admin_name';
                    if ($_GET['orderby'] == "order_status")
                        $_GET['orderby'] = 'order_status';
                }

                // turn associative array to segments to append to base_url
                //$keys = $this->uri->assoc_to_uri($searchparams_uri);
                $keys = $this->uri->assoc_to_uri($searchparams);

                // set total_rows config data for pagination			
                $config['total_rows'] = $this->Account_model->pending_count_all_search($searchparams);
            }
        }
        else {

            // load data
            $offset = $this->uri->segment($total_seg, '');
            $orderby = array();
            if (isset($_GET['orderby'])) {
                if ($_GET['orderby'] == "order_no")
                    $_GET['orderby'] = 'order_no';
                if ($_GET['orderby'] == "usertype")
                    $_GET['orderby'] = 'usertype';
                if ($_GET['orderby'] == "subject_name")
                    $_GET['orderby'] = 'subject_name';
                if ($_GET['orderby'] == "number_of_pic")
                    $_GET['orderby'] = 'number_of_pic';
                if ($_GET['orderby'] == "due_date")
                    $_GET['orderby'] = 'due_date';
                if ($_GET['orderby'] == "admin_name")
                    $_GET['orderby'] = 'admin_name';
                if ($_GET['orderby'] == "order_status")
                    $_GET['orderby'] = 'order_status';

                $orderby['order'] = $_GET['order'];
                $orderby['orderby'] = $_GET['orderby'];
            }
            $parents = $this->Account_model->pending_get_paged_list($this->limit, $offset, $orderby)->result();
            //echo $this->db->last_query();
            //die ;
            if (isset($_GET['orderby'])) {
                if ($_GET['orderby'] == "order_no")
                    $_GET['orderby'] = 'order_no';
                if ($_GET['orderby'] == "usertype")
                    $_GET['orderby'] = 'usertype';
                if ($_GET['orderby'] == "subject_name")
                    $_GET['orderby'] = 'subject_name';
                if ($_GET['orderby'] == "number_of_pic")
                    $_GET['orderby'] = 'number_of_pic';
                if ($_GET['orderby'] == "due_date")
                    $_GET['orderby'] = 'due_date';
                if ($_GET['orderby'] == "admin_name")
                    $_GET['orderby'] = 'admin_name';
                if ($_GET['orderby'] == "order_status")
                    $_GET['orderby'] = 'order_status';
            }

            $config['total_rows'] = $this->Account_model->complete_count_all();
            $searchparams = "";
            $keys = "";
        }

        // generate pagination
        //$this->load->library('pagination');


        $config['base_url'] = site_url('user/account/consumer_complete_order/') . '/' . $keys . '/';
        if (isset($_GET['orderby']))
            $config['suffix'] = "?orderby=" . $_GET['orderby'] . "&order=" . $_GET['order'];
        $config['per_page'] = $this->limit;

        $config['uri_segment'] = $uri_segment;
        $this->pagination->initialize($config);
        $paginate = $this->pagination->create_links();

        $data = array(
            'orderdata' => $parents,
            'contact_count' => $config['total_rows'],
            'paginate' => $paginate,
        );
        $view = 'user/consumer-complete-orders';
        user_view_loader($view, $data);
    }

    public function account_details() {
        $data = array();
        $result = $this->Account_model->get_user_details($this->user);
        $data['userdata'] = $result;
        $view = 'user/account-details';
        user_view_loader($view, $data);
    }

    public function edit_account() {
        if (isset($_POST['edit_submit'])) {
            $this->form_validation->set_rules($this->validation_rules['valid_account_edit']);
            if ($this->form_validation->run()) {
                $post = array();
                $post['contact_name'] = $this->input->post('full_name');
                $post['phone_no'] = $this->input->post('phone_no');
                $post['shipping_address'] = $this->input->post('shipping_address');
                $post['city'] = $this->input->post('city');
                $post['state'] = $this->input->post('state');
                $post['zip'] = $this->input->post('zip');
                $post['country'] = $this->input->post('country');
                $post['notify_submit'] = $this->input->post('not_ord_sub');
                $post['notify_complete'] = $this->input->post('not_ord_com');
                if (!empty($_POST['password'])) {
                    $post['password'] = generate_password($this->input->post('password'));
                }
                $this->Account_model->update_user_details($post, $this->user);
                redirect('user/account/account_details');
            }
        }
        $result = $this->Account_model->get_user_details($this->user);
        $data['userdata'] = $result;
        $view = 'user/edit-account-details';
        user_view_loader($view, $data);
    }

    /* create order page */

    public function create_order() {
        $data = array();
        if (isset($_POST['special_instructions'])) {
            $this->form_validation->set_rules($this->validation_rules['valid_order_add']);
            if ($this->form_validation->run()) {


                $resvationtime = strtotime($this->input->post('due_date'));
                $resvation_time = date('y', $resvationtime) . date('m', $resvationtime) . date('d', $resvationtime) . date('H', $resvationtime) . date('i', $resvationtime);
                $row_price = $this->input->post('price');
                switch ($row_price) {
                    case '26-40':
                        $price = 195;
                        break;
                    case '41-71':
                        $price = 245;
                        break;
                    case '33-40':
                        $price = 195;
                        break;
                    case '47-86':
                        $price = 295;
                        break;
                    case 'custom':
                        $price = 0;
                        break;
                }

                $post = array();
                $post['order_no'] = $resvation_time;
                $post['user_id'] = $this->user;
                $post['order_price_package'] = '1';
                $post['order_price_option'] = $row_price;
                $post['order_price'] = $price;
                $post['number_of_pic'] = $this->input->post('number_of_pic');
                $post['special_instructions'] = $this->input->post('special_instructions');
                $post['dvd_case_cover'] = $this->input->post('dvd_case_cover');
                $post['flash_drive_case_cover'] = $this->input->post('drive_case_cover');
                $post['select_template'] = $this->input->post('template');
                $post['style_option'] = $this->input->post('style_option');
                $post['video_type'] = $this->input->post('video_type');
                $post['place_order'] = $this->input->post('place_order');
                $post['contact_name'] = $this->input->post('contact_name');
                $post['email'] = $this->input->post('email');
                $post['phone'] = $this->input->post('phone_no');
                $post['recieve_text_msg'] = $this->input->post('recieve_text_msg');


                if (isset($_POST['edit_templete']) && !empty($_POST['edit_templete'])) {
                    $post['order_status'] = 'waiting';
                    $post['order_post_complete'] = 'No';
                    $post['modify_date'] = time();
                    $this->Account_model->update_order($_POST['edit_templete'], $post);
                    $order_id = $_POST['edit_templete'];
                } else {
                    $post['order_status'] = 'waiting';
                    $post['order_post_complete'] = 'No';
                    $post['create_date'] = time();
                    $order_id = $this->Account_model->add_order($post);
                }

                $post_details = array();
                $post_details['order_id'] = $order_id;
                $post_details['subject_name'] = $this->input->post('subject_name');
                $post_details['date_of_birth'] = $this->input->post('dob');
                $post_details['date_of_death'] = $this->input->post('dod');
                $post_details['name1'] = $this->input->post('name1');
                $post_details['name2'] = $this->input->post('name2');
                $post_details['date1'] = $this->input->post('date1');
                $post_details['date2'] = $this->input->post('date2');
                $post_details['closing_quote_verse'] = $this->input->post('closing_quote_verse');
                $post_details['quote'] = $this->input->post('quote');
                $post_details['due_date'] = strtotime($this->input->post('due_date'));
                $post_details['custom_instructions'] = $this->input->post('notes_special_instructions');
                $post_details['cover'] = $this->input->post('cover_radiosel');
                $post_details['scenery'] = serialize($this->input->post('scenery_boxchk'));
                $post_details['music'] = serialize($this->input->post('music_boxchk'));


                if (isset($_POST['edit_templete']) && !empty($_POST['edit_templete'])) {
                    $post_details['modify_date'] = time();
                    $this->Account_model->update_order_details($_POST['edit_templete'], $post_details);
                } else {
                    if (!empty($order_id)) {
                        $post_details['create_date'] = time();
                        $this->Account_model->add_order_details($post_details);
                    }
                }
                if (isset($_POST['save_later']) && $_POST['save_later'] == 'Save For Later Use') {
                    redirect('user/account/');
                }

                //redirect('user/account/cusumer_review_order/'.$order_id);
                redirect('user/account/uploader/' . $order_id);
            }
        }
        //$result = $this->Account_model->get_user_details($this->user);
        //$data['userdata'] = $result ;
        $view = 'user/consumer-order-in-one-page';
        user_view_loader($view, $data);
    }

    public function edit_order($id) {
        $data = array();
        if (isset($_POST['special_instructions'])) {
            $row_price = $this->input->post('price');
            switch ($row_price) {
                case '26-40':
                    $price = 195;
                    break;
                case '41-71':
                    $price = 245;
                    break;
                case '33-40':
                    $price = 195;
                    break;
                case '47-86':
                    $price = 295;
                    break;
                case 'custom':
                    $price = 0;
                    break;
            }
            $post = array();
            $post['order_price_package'] = '1';
            $post['order_price_option'] = $row_price;
            $post['order_price'] = $price;
            $post['number_of_pic'] = $this->input->post('number_of_pic');
            $post['special_instructions'] = $this->input->post('special_instructions');
            $post['dvd_case_cover'] = $this->input->post('dvd_case_cover');
            $post['flash_drive_case_cover'] = $this->input->post('drive_case_cover');
            $post['select_template'] = $this->input->post('template');
            $post['style_option'] = $this->input->post('style_option');
            $post['video_type'] = $this->input->post('video_type');
            $post['place_order'] = $this->input->post('place_order');
            $post['contact_name'] = $this->input->post('contact_name');
            $post['email'] = $this->input->post('email');
            $post['phone'] = $this->input->post('phone_no');
            $post['recieve_text_msg'] = $this->input->post('recieve_text_msg');


            if (isset($_POST['edit_templete']) && !empty($_POST['edit_templete'])) {
                $post['order_status'] = 'waiting';
                $post['order_post_complete'] = 'No';
                $post['modify_date'] = time();
                $this->Account_model->update_order($_POST['edit_templete'], $post);
                $order_id = $_POST['edit_templete'];
            }
            $post_details = array();
            $post_details['order_id'] = $order_id;
            $post_details['subject_name'] = $this->input->post('subject_name');
            $post_details['date_of_birth'] = $this->input->post('dob');
            $post_details['date_of_death'] = $this->input->post('dod');
            $post_details['name1'] = $this->input->post('name1');
            $post_details['name2'] = $this->input->post('name2');
            $post_details['date1'] = $this->input->post('date1');
            $post_details['date2'] = $this->input->post('date2');
            $post_details['closing_quote_verse'] = $this->input->post('closing_quote_verse');
            $post_details['quote'] = $this->input->post('quote');
            $post_details['due_date'] = strtotime($this->input->post('due_date'));
            $post_details['custom_instructions'] = $this->input->post('notes_special_instructions');
            $post_details['cover'] = $this->input->post('cover_radiosel');
            $post_details['scenery'] = serialize($this->input->post('scenery_boxchk'));
            $post_details['music'] = serialize($this->input->post('music_boxchk'));

            if (isset($_POST['edit_templete']) && !empty($_POST['edit_templete'])) {
                $post_details['modify_date'] = time();
                $this->Account_model->update_order_details($_POST['edit_templete'], $post_details);
                //echo $this->db->last_query();
                //die();
            }
            if (isset($_POST['save_later']) && $_POST['save_later'] == 'Save For Later Use') {
                redirect('user/account/');
            }

            //redirect('user/account/cusumer_review_order/'.$order_id);
            redirect('user/account/uploader/' . $order_id);
        }

        if (!empty($id)) {
            $data['result'] = $this->Account_model->get_order_detail($id);
            $view = 'user/consumer-order-in-one-page';
            user_view_loader($view, $data);
        }
    }

    public function consumer_order_list() {
        $data = array();
        $view = 'user/consumer-pending-orders';
        user_view_loader($view, $data);
    }

    public function uploader($order_id) {
        $data = array('order_id' => $order_id);
        $view = 'user/uploader';
        user_view_loader($view, $data);
    }

    public function cusumer_review_order($id = NULL) {
        $data = array();
        if (!empty($id)) {
            $data['result'] = $this->Account_model->get_review_order($id);

            $view = 'user/consumer-review-order';
            user_view_loader($view, $data);
        }
    }

    public function checkout($id) {
        $data = array();
        //$id = $this->input->post('order_name');
        if (!empty($id)) {
            if (isset($_POST['order_sumbit'])) {
                require_once('paypal/PPBootStrap.php');
                $firstName = $_POST['firstName'];
                $lastName = $_POST['lastName'];
                $_POST['address2'] = '';


                $post = array();
                if (isset($_POST['sendcode']) && !empty($_POST['sendcode'])) {
                    $promo_det = $this->Account_model->check_promocode($_POST['sendcode']);

                    if ($promo_det->method == "price") {
                        $total = $_POST['subtotal'] - $promo_det->amount;
                    } else {
                        $per = ($_POST['subtotal'] * $promo_det->amount) / 100;
                        $total = $_POST['subtotal'] - $per;
                        $promo_det->per = $per;
                    }
                    $_POST['amount'] = $total;

                    $_POST['amount'] = 1;

                    if (isset($promo_det->promo_id))
                        $post['promo_code'] = $_POST['sendcode'];
                    $post['promocode_amount'] = $promo_det->amount;
                    $post['promocode_method'] = $promo_det->method;
                }
                //$post['promocode_method'] = $promo_det->method;

                /*
                 * shipping adress
                 */
                $address = new AddressType();
                $address->Name = "$firstName $lastName";
                $address->Street1 = $_POST['shipping_address'];
                $address->Street2 = $_POST['address2'];
                $address->CityName = $_POST['city'];
                $address->StateOrProvince = $_POST['state'];
                $address->PostalCode = $_POST['zip'];
                $address->Country = $_POST['country'];
                //$address->Phone = $_POST['phone'];

                $paymentDetails = new PaymentDetailsType();
                $paymentDetails->ShipToAddress = $address;

                $paymentDetails->OrderTotal = new BasicAmountType('USD', $_POST['amount']);

                if (isset($_REQUEST['notifyURL'])) {
                    $paymentDetails->NotifyURL = $_REQUEST['notifyURL'];
                }

                $personName = new PersonNameType();
                $personName->FirstName = $firstName;
                $personName->LastName = $lastName;

                //information about the payer
                $payer = new PayerInfoType();
                $payer->PayerName = $personName;
                $payer->Address = $address;
                $payer->PayerCountry = $_POST['country'];

                $cardDetails = new CreditCardDetailsType();
                $cardDetails->CreditCardNumber = $_POST['creditCardNumber'];


                $cardDetails->CreditCardType = $_POST['creditCardType'];
                $cardDetails->ExpMonth = $_POST['expDateMonth'];
                $cardDetails->ExpYear = $_POST['expDateYear'];
                $cardDetails->CVV2 = $_POST['ccv'];
                $cardDetails->CardOwner = $payer;

                $ddReqDetails = new DoDirectPaymentRequestDetailsType();
                $ddReqDetails->CreditCard = $cardDetails;
                $ddReqDetails->PaymentDetails = $paymentDetails;

                $doDirectPaymentReq = new DoDirectPaymentReq();
                $doDirectPaymentReq->DoDirectPaymentRequest = new DoDirectPaymentRequestType($ddReqDetails);

                /*
                 * 		 ## Creating service wrapper object
                  Creating service wrapper object to make API call and loading
                  Configuration::getAcctAndConfig() returns array that contains credential and config parameters
                 */
                $paypalService = new PayPalAPIInterfaceServiceService(Configuration::getAcctAndConfig());
                try {
                    /* wrap API method calls on the service object with a try catch */
                    $doDirectPaymentResponse = $paypalService->DoDirectPayment($doDirectPaymentReq);
                    if ($doDirectPaymentResponse->Ack == "Success") {
                        $post[''] = $_POST['amount'];
                        $post['order_post_complete'] = 'complete';
                    }
                } catch (Exception $ex) {
                    redirect(base_url() . 'user/account/failedpage/');
                    exit;
                }
            }

            $order_pay = $this->Account_model->check_order_payment($id);
            if (empty($order_pay)) {
                $data['result'] = $this->Account_model->get_review_order($id);
                $view = 'user/checkout';
                user_view_loader($view, $data);
            }
        }
    }

    public function do_payment() {
        if (isset($_POST[''])) {
            require_once('paypal/PPBootStrap.php');
            $firstName = $_POST['firstName'];
            $lastName = $_POST['lastName'];
            /*
             * shipping adress
             */
            $address = new AddressType();
            $address->Name = "$firstName $lastName";
            $address->Street1 = $_POST['address1'];
            $address->Street2 = $_POST['address2'];
            $address->CityName = $_POST['city'];
            $address->StateOrProvince = $_POST['state'];
            $address->PostalCode = $_POST['zip'];
            $address->Country = $_POST['country'];
            $address->Phone = $_POST['phone'];

            $paymentDetails = new PaymentDetailsType();
            $paymentDetails->ShipToAddress = $address;

            $paymentDetails->OrderTotal = new BasicAmountType('USD', $_POST['amount']);

            if (isset($_REQUEST['notifyURL'])) {
                $paymentDetails->NotifyURL = $_REQUEST['notifyURL'];
            }

            $personName = new PersonNameType();
            $personName->FirstName = $firstName;
            $personName->LastName = $lastName;

            //information about the payer
            $payer = new PayerInfoType();
            $payer->PayerName = $personName;
            $payer->Address = $address;
            $payer->PayerCountry = $_POST['country'];

            $cardDetails = new CreditCardDetailsType();
            $cardDetails->CreditCardNumber = $_POST['creditCardNumber'];


            $cardDetails->CreditCardType = $_POST['creditCardType'];
            $cardDetails->ExpMonth = $_POST['expDateMonth'];
            $cardDetails->ExpYear = $_POST['expDateYear'];
            $cardDetails->CVV2 = $_POST['cvv2Number'];
            $cardDetails->CardOwner = $payer;

            $ddReqDetails = new DoDirectPaymentRequestDetailsType();
            $ddReqDetails->CreditCard = $cardDetails;
            $ddReqDetails->PaymentDetails = $paymentDetails;

            $doDirectPaymentReq = new DoDirectPaymentReq();
            $doDirectPaymentReq->DoDirectPaymentRequest = new DoDirectPaymentRequestType($ddReqDetails);

            /*
             * 		 ## Creating service wrapper object
              Creating service wrapper object to make API call and loading
              Configuration::getAcctAndConfig() returns array that contains credential and config parameters
             */
            $paypalService = new PayPalAPIInterfaceServiceService(Configuration::getAcctAndConfig());
            try {
                /* wrap API method calls on the service object with a try catch */
                $doDirectPaymentResponse = $paypalService->DoDirectPayment($doDirectPaymentReq);
            } catch (Exception $ex) {
                redirect(base_url() . 'rental/failedpage/');
                exit;
            }
        }
    }

    /* check password */

    public function valid_check_password($password) {
        if (!empty($password)) {
            $minlength = 6;
            if (strlen($password) > $minlength && preg_match('/[a-z]/', $password) && preg_match('/[A-Z]/', $password) && preg_match('/[0-9]/', $password)) {
                return TRUE;
            } else {
                $this->form_validation->set_message('valid_check_password', 'passwords will be at least 7 characters in length one capital letter and at least one number');
                return False;
            }
        }
    }

    public function check_promocode() {
        if (isset($_POST['promocode']) && !empty($_POST['promocode'])) {
            $result = $this->Account_model->check_promocode($_POST['promocode']);
            if (isset($result->promo_id) && !empty($result->promo_id)) {
                if ($result->method == "price") {
                    $total = $_POST['subtotal'] - $result->amount;
                } else {
                    $per = ($_POST['subtotal'] * $result->amount) / 100;
                    $total = $_POST['subtotal'] - $per;
                    $result->per = $per;
                }
                $result->total = $total;
                echo json_encode($result);
                die();
            } else {
                echo 'failed';
            }
        }
    }

    public function failedpage() {
        
    }

    public function aurigma_upload() {
        $account_controller = $this;
        require_once APPPATH . "libraries/ImageUploaderFlashPHP/UploadHandler.class.php";

        function saveUploadedFile($uploadedFile) {
            //...
        }

        function getSafeFileName($path, $fileName, $overwrite = FALSE) {

            // Replace special characters in the file name
            $fileName = str_replace('%20', ' ', $fileName);
            $fileName = preg_replace('/[^a-z0-9_\-\.()\[\]{}]/i', '_', $fileName);

            if (!$overwrite && file_exists($path . DIRECTORY_SEPARATOR . $fileName)) {
                $file_parts = pathinfo($fileName);
                //get fileName without extension
                $newFileName = $file_parts['filename'];
                //get extension
                $ext = $file_parts['extension'];
                if ($ext != '') {
                    $ext = '.' . $ext;
                }
                $i = 0;
                while (file_exists($path . DIRECTORY_SEPARATOR . $newFileName . '_' . $i . $ext)) {
                    $i++;
                }
                return $newFileName . '_' . $i . $ext;
            } else {
                return $fileName;
            }
        }

        function array_get_value_or_default($array, $key, $default = NULL) {
            if (array_key_exists($key, $array)) {
                return $array[$key];
            } else {
                return $default;
            }
        }

        function saveAllUploadedFiles($uploadedFiles) {
            // global note for each image
            $packageFields = $uploadedFiles[0]->getPackage()->getPackageFields();
            $note = $packageFields["note"];
            $order_id = $packageFields["order_id"];

            //Get total number of uploaded files (all files are uploaded in a single package).
            $fileCount = $_POST["PackageFileCount"];

            $ci = & get_instance();
            $ci->load->model('user/Account_model');
            $user_id = $ci->session->userdata['Front_userId'];
            //$user_id = $_SESSION['userId'];

            $image_order = $ci->Account_model->get_max_image_order($order_id);

            foreach ($uploadedFiles as $uploadedFile) {
                $path = "./assets/user_order_images/";
                $dir = $order_id . '-' . $user_id;
                $thumb_dir = $dir . DIRECTORY_SEPARATOR . 'thumbnail';
                if (!file_exists($dir)) { // create directory to store order images
                    @mkdir($path . $dir, 0777);
                }
                if (!file_exists($thumb_dir)) { // create thumbnail directory
                    @mkdir($path . $thumb_dir, 0777);
                }

                $savePath = realpath('assets/user_order_images/' . $dir);
                $thumbSavePath = realpath('assets/user_order_images/' . $thumb_dir);
                $convertedFiles = $uploadedFile->getConvertedFiles();
                //Save original file.
                //It is the first file in ConvertedFiles collection as we set first converter mode to SourceFile.
                $sourceFile = $convertedFiles[0];
                $thumbnail = $convertedFiles[1];
                $sourceFileName = getSafeFileName($savePath, rawurlencode($uploadedFile->getSourceName()));
                $fullFilePath = $savePath . DIRECTORY_SEPARATOR . $sourceFileName;
                $fullFileThumbnailPath = $thumbSavePath . DIRECTORY_SEPARATOR . $sourceFileName;

                $description = $uploadedFile->getDescription();
                if ($note != '') { // If global note/comment given then save it instead of image specific note
                    $description = $note;
                }

                if ($description == '') {
                    $description = NULL;
                }

                $image_order = $image_order + 1; //increment image_order
                $img_data = array(
                    'order_id' => $order_id,
                    'user_id' => $user_id,
                    'image_path' => $sourceFileName,
                    'img_comment' => $description,
                    'img_order' => $image_order,
                    'created_at' => date('Y/m/d'),
                    'status' => 'Active'
                );

                $ci->Account_model->db_save_order_image($img_data); // save data to DB
                $sourceFile->moveTo($fullFilePath); // save file to ./assets/user_order_images/
                $thumbnail->moveTo($fullFileThumbnailPath); // save thumbnail to ./assets/user_order_images/{dir-to-save}/thumbnail
            }

            /* // setting comments
              for ($i = 0; $i < $fileCount; $i++) {
              $originalFileName = $_POST['SourceName_' . $i];
              $image_description = array_get_value_or_default($_REQUEST, 'Description_' . $i, '');
              } */
        }

        $handler = new UploadHandler();
        $savePath = realpath('assets/user_order_images/');
        //$handler->saveFiles($savePath); //die; // for direct upload without processing
        $handler->setFileUploadedCallback("saveUploadedFile");
        $handler->setAllFilesUploadedCallback("saveAllUploadedFiles");
        $handler->processRequest();
    }

    public function get_user_order_images($order_id) {
        $result = $this->Account_model->get_order_images($order_id);
        echo json_encode($result);
        die;
    }

    public function re_order() {
        if (isset($_REQUEST['data'])) {
            $newImageSequence = $_REQUEST['data'];
            $result = $this->Account_model->reorder_images($newImageSequence);
            $response = '';
            if ($result) {
                $response = array(
                    'error' => false,
                    'message' => 'Image(s) re-ordered successfully!'
                );
            } else {
                $response = array(
                    'error' => true,
                    'message' => 'Error: Can not re-order image(s)'
                );
            }
            echo json_encode($response);
            die;
        }
    }

}
?>
