<?php
//
//namespace Bioversity\ServerConnectionBundle\Repository;
//
//use Symfony\Bundle\FrameworkBundle\Controller\Controller;
//use Symfony\Component\Security\Core\SecurityContext;
//use Bioversity\ServerConnectionBundle\Repository\Tags;
//use Bioversity\ServerConnectionBundle\Repository\Operators;
//use Bioversity\ServerConnectionBundle\Repository\HttpServerConnection;
//
//class ServerConnection extends HttpServerConnection
//{  
//  /**
//   * Returns the tags language list
//   * @param string $tags
//   *  
//   * @return array $serverResponce
//   */
//  public function getTags($tags)
//  {
//    $this->setDatabase('ONTOLOGY');
//    $this->setCollection(NULL);
//    $query= $this->createQuery(Tags::kTAG_NID, Types::kTYPE_INT, $tags, Operators::kOPERATOR_IN);
//    $params= $this->createRequest('WS:OP:GetTag', $query);
//    return $this->sendRequest($this->wrapper, $params);
//  }
//  
//  /**
//   * Returns the tags language list
//   * @param string $tags
//   *  
//   * @return array $serverResponce
//   */
//  public function getTagByGID($tags)
//  {
//    $this->setDatabase('ONTOLOGY');
//    $this->setCollection(NULL);
//    $query= $this->createQuery(Tags::kTAG_GID, Types::kTYPE_STRING, $tags, Operators::kOPERATOR_EQUAL);
//    $params= $this->createNewRequest('WS:OP:GetTag', Array($query));
//    return $this->sendRequest($this->wrapper, $params);
//  }
//  
//  /**
//   * Returns the enumeration options
//   * @param int $id
//   *  
//   * @return array $serverResponce
//   */
//  public function getEnumOptions($id)
//  {
//    $this->setDatabase('ONTOLOGY');
//    $this->setCollection(NULL);
//    $query= $this->createQuery(Tags::kTAG_NID, Types::kTYPE_INT, $id, Operators::kOPERATOR_EQUAL);
//    $params= $this->createRequest('WS:OP:GetEnums', $query, NULL, 'COntologyTag');
//    return $this->sendRequest($this->wrapper, $params);
//  }
//  
//  /**
//   * Returns the options value for distinct query response
//   * @param array $tag
//   * @param string $type
//   *  
//   * @return array $options
//   */
//  //TODO: move this method in another class
//  public function getDistinctDetail($tags, $type)
//  {
//      $options= array();
//      
//      foreach($tags as $key=>$tag){
//        switch ($type){
//          case ':TEXT':
//            $options[$tag]= $tag;
//            break;
//          case ':ENUM':
//            $term= $this->getTerm($tag);            
//            $label= $term[':WS:RESPONSE']['_term'][$term[':WS:RESPONSE']['_ids'][0]][Tags::kTAG_LABEL]['en'];
//            $options[$tag]= $label;
//            break;
//        }
//      }
//      
//      return $options;
//  }
//  
//  /**
//   * Returns the term requested
//   * @param string $namespace
//   *  
//   * @return array $serverResponce
//   */
//  public function getNamespace($namespace)
//  {
//    $this->setDatabase('ONTOLOGY');
//    $this->setCollection(NULL);
//    $query= $this->createQuery(Tags::kTAG_GID, Types::kTYPE_STRING, $namespace, Operators::kOPERATOR_EQUAL);
//    $params= $this->createRequest('WS:OP:GetTerm', $query);
//    
//    return $this->sendRequest($this->wrapper, $params);
//  }
//  
//  /**
//   * Returns the term requested
//   * @param string $code
//   * @param string $namespace
//   *  
//   * @return array $serverResponce
//   */
//  public function getTerm($code, $namespace=NULL)
//  {
//    $this->setDatabase('ONTOLOGY');
//    $this->setCollection(NULL);
//    
//    $gid= $namespace ? $namespace.':'.$code : $code;
//    
//    $query1= $this->createQuery(Tags::kTAG_GID, Types::kTYPE_STRING, $gid, Operators::kOPERATOR_EQUAL);
//    $params= $this->createRequest('WS:OP:GetTerm', $query1);
//  
//    return $this->sendRequest($this->wrapper, $params);
//  }  
//  
//  /**
//   * Returns the Node list requested
//   * @param string $nid
//   *  
//   * @return array $serverResponce
//   */
//  public function getNodeByNIDTerm($nid)
//  {
//    $this->setDatabase('ONTOLOGY');
//    $this->setCollection(NULL);
//    $query= $this->createQuery(Tags::kTAG_TERM, Types::kTYPE_STRING, $nid, Operators::kOPERATOR_EQUAL);
//    $params= $this->createRequest('WS:OP:GetVertex', $query);
//    
//    return $this->sendRequest($this->wrapper, $params);
//  }
//  
//  /**
//   * Returns the term requested
//   * @param string $code
//   *  
//   * @return array $serverResponce
//   */
//  public function getTermByCode($code)
//  {
//    $this->setDatabase('ONTOLOGY');
//    $this->setCollection(NULL);
//    $query= $this->createQuery(Tags::kTAG_LID, Types::kTYPE_STRING, $code, Operators::kOPERATOR_EQUAL);
//    $params= $this->createRequest('WS:OP:GetTerm', $query);
//    
//    return $this->sendRequest($this->wrapper, $params);
//  }
//  
//  /**
//   * Returns the term requested
//   *  
//   * @return array $serverResponce
//   */
//  public function getLID($code, $namespace=NULL)
//  {
//    $this->setDatabase('ONTOLOGY');
//    $this->setCollection(NULL);
//    
//    if($namespace){
//      $query2= $this->createQuery(Tags::kTAG_NAMESPACE, Types::kTYPE_STRING, $namespace, Operators::kOPERATOR_EQUAL);
//      $params= $this->createRequest('WS:OP:GetTerm', $query1, $query2);
//    }else{
//      $params= $this->createRequest('WS:OP:GetTerm', $query1);
//    }
//    return $this->sendRequest($this->wrapper, $params);
//  }
//  
//  //-----------SAVER-----------------//
//  
//  
//  /**
//   * Create new namespace/term
//   * 
//   */
//  public function saveNew($object, $metod, $class=null)
//  {
//    $params = array(
//      ':WS:FORMAT=:JSON',
//      ':WS:OPERATION=WS:OP:'.$metod,
//      ':WS:DATABASE='.urlencode(json_encode('ONTOLOGY')),
//      ':WS:OBJECT='.urlencode(json_encode($object)),
//      ':WS:LOG-REQUEST='.urlencode(json_encode(1)),
//      //':WS:LOG-TRACE='.urlencode(json_encode(1))
//      );
//    
//    if($class)
//      $params[]=':WS:CLASS='.urlencode(json_encode($class));
//    
//    return $this->sendRequest($this->wrapper, $params);
//  }
//  
//  /**
//   * Create new nodes Relation
//   * @param int $subject
//   * @param string $predicate
//   * @param int $object
//   *  
//   * @return array $serverResponce
//   */
//  public function saveRelation($subject, $predicate, $object)
//  {
//    $params = array(
//      ':WS:FORMAT=:JSON',
//      ':WS:OPERATION=WS:OP:RelateTo',
//      ':WS:DATABASE='.urlencode(json_encode('ONTOLOGY')),
//      ':WS:PREDICATE='.urlencode(json_encode($predicate)),
//      ':WS:REL-FROM='.urlencode(json_encode($object)),
//      ':WS:REL-TO='.urlencode(json_encode($subject)),
//      ':WS:LOG-REQUEST='.urlencode(json_encode(1)),
//      ':WS:LOG-TRACE='.urlencode(json_encode(1))
//      );
//    
//    return $this->sendRequest($this->wrapper, $params);
//  }
//  
//}