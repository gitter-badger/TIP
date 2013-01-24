<?php

namespace Bioversity\SecurityBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\Collection;
use Symfony\Component\Validator\Constraints\Choice;

class BioversityUserRegistrationType extends AbstractType
{

    public function getName()
    {
        return 'BioversityUserRegistration';
    }
    
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('fullname', 'text', array('required' => true));
        $builder->add('username', 'text', array('required' => true));
        $builder->add('password', 'text', array('required' => true));
        $builder->add('email', 'email', array('required' => true));
        $builder->add('roles', 'choice', array(
            'choices'   => array(
                'ROLE_DATA'     => 'Data Entry Role',
                'ROLE_ONTOLOGY' => 'Ontology Curator Role'
                ),
            'required' => true,
            'multiple' => true,
            'expanded' => true
            )
        );
    }
}