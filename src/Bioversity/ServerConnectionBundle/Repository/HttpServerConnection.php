<?php

namespace Bioversity\ServerConnectionBundle\Repository;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Security\Core\SecurityContext;
use Bioversity\SecurityBundle\Repository\Tags;

class HttpServerConnection
{
  var $db= 'USERS';
  var $collection= 'CUser';
  var $domain= "TIP";
  var $wrapper= "http://192.168.181.11/TIP/Wrapper.php";
  
  public function setDatabase($db)
  {
    $this->db= $db;
  }
  
  public function setCollection($collection)
  {
    $this->collection= $collection;
  }
  
  /**
   * Create the Request for the WebServer request
   * 
   * @param string $operation
   * @param string $username
   * @param bool $query
   *  
   * @return array $request
   */
  public function createRequest($operation, $query1= NULL, $query2= NULL)
  {      
    $request= $this->buildQuery($this->db, $operation, $query1, $query2, 1);
   
    return $request;
  }
  
  /*
   * Create the query array for the request
   *
   * @param string $subject
   * @param string $type
   * @param string $data
   *
   * @return array $query
   */
  public function createQuery($subject, $type=':TEXT', $data, $operator = '$EQ')
  {
    return $query= Array('_query-subject'=>$subject, '_query-operator'=>$operator, '_query-data-type'=>$type, '_query-data' => $data);
  }
  
  /**
   * Builds and send the Query for the WebServer request
   *
   * @param string $db
   * @param string $operation
   * @param string $username
   * @param array $query
   * @param bool $log
   *
   * @return array $request
   *
   */
  public function buildQuery($db, $operation, $query1= NULL, $query2= NULL, $log=NULL)
  {
    $request= array(
                ':WS:OPERATION='.$operation,
                ':WS:FORMAT=:JSON',
                ':WS:DATABASE='.urlencode(json_encode($db))
            );
    
    if($this->collection)
      $request[]=':WS:CONTAINER='.urlencode(json_encode($this->collection));
    
    if($query2 === NULL)
        $request[]=':WS:QUERY='.urlencode(json_encode(Array('$AND' => Array($query1))));
    else
        $request[]=':WS:QUERY='.urlencode(json_encode(Array('$AND' => Array($query1,$query2))));
      
    if($log)
      $request[]=':WS:LOG-REQUEST='.urlencode(json_encode($log));
    
    return $request;
  }
  
  public function sendRequest($server, $request)
  {
    //return var_dump($server.'?'.implode( '&', $request ));
    return json_decode(file_get_contents( $server.'?'.implode( '&', $request ) ), true);
  }
}