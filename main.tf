terraform {
  backend "s3" {
    bucket = "dnissley-terraform"
    key = "experimental-node-server/terraform.tfstate"
    region = "us-east-2"
  }
}

provider "aws" {
  version = "~> 2.0"
  region  = "us-east-2"
}

resource "aws_ecr_repository" "experimental_node_server" {
  name = "experimental-node-server"
}

resource "aws_ecs_cluster" "experimental_node_server" {
  name = "experimental-node-server"
}

resource "aws_ecs_task_definition" "experimental_node_server" {
  family                   = "experimental-node-server"
  container_definitions    = <<DEFINITION
  [
    {
      "name": "experimental-node-server",
      "image": "${aws_ecr_repository.experimental_node_server.repository_url}",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 3000,
          "hostPort": 3000
        }
      ],
      "memory": 512,
      "cpu": 256
    }
  ]
  DEFINITION
  requires_compatibilities = ["FARGATE"] # Stating that we are using ECS Fargate
  network_mode             = "awsvpc"    # Using awsvpc as our network mode as this is required for Fargate
  memory                   = 512         # Specifying the memory our container requires (in mb)
  cpu                      = 256         # Specifying the CPU our container requires (equivalent to 0.25 vCpu)
  execution_role_arn       = data.aws_iam_role.ecs_task_execution_role.arn
}

data "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"
}

resource "aws_ecs_service" "experimental_node_server" {
  name            = "experimental-node-server"
  cluster         = aws_ecs_cluster.experimental_node_server.id
  task_definition = aws_ecs_task_definition.experimental_node_server.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  load_balancer {
    target_group_arn = aws_lb_target_group.target_group.arn
    container_name   = aws_ecs_task_definition.experimental_node_server.family
    container_port   = 3000
  }

  network_configuration {
    subnets          = [aws_default_subnet.default_subnet_a.id, aws_default_subnet.default_subnet_b.id, aws_default_subnet.default_subnet_c.id]
    assign_public_ip = true
    security_groups  = [aws_security_group.service_security_group.id]
  }
}

resource "aws_security_group" "service_security_group" {
  ingress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    # Only allowing traffic in from the load balancer security group
    security_groups = [aws_security_group.load_balancer_security_group.id]
  }

  egress {
    from_port   = 0 # Allowing any incoming port
    to_port     = 0 # Allowing any outgoing port
    protocol    = "-1" # Allowing any outgoing protocol 
    cidr_blocks = ["0.0.0.0/0"] # Allowing traffic out to all IP addresses
  }
}

resource "aws_default_vpc" "default_vpc" {}

resource "aws_default_subnet" "default_subnet_a" {
  availability_zone = "us-east-2a"
}

resource "aws_default_subnet" "default_subnet_b" {
  availability_zone = "us-east-2b"
}

resource "aws_default_subnet" "default_subnet_c" {
  availability_zone = "us-east-2c"
}

resource "aws_lb" "application_load_balancer" {
  name               = "experimental-node-server-lb"
  load_balancer_type = "application"
  subnets            = [aws_default_subnet.default_subnet_a.id, aws_default_subnet.default_subnet_b.id, aws_default_subnet.default_subnet_c.id]
  security_groups    = [aws_security_group.load_balancer_security_group.id]
}

resource "aws_security_group" "load_balancer_security_group" {
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0 # Allowing any incoming port
    to_port     = 0 # Allowing any outgoing port
    protocol    = "-1" # Allowing any outgoing protocol 
    cidr_blocks = ["0.0.0.0/0"] # Allowing traffic out to all IP addresses
  }
}

resource "aws_lb_target_group" "target_group" {
  name        = "target-group"
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_default_vpc.default_vpc.id
}

resource "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_lb.application_load_balancer.arn
  port              = "80"
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.target_group.arn
  }
}

resource "aws_lb_listener" "https_listener" {
  load_balancer_arn = aws_lb.application_load_balancer.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = aws_acm_certificate.nodejs_subdomain.arn
  default_action {
    target_group_arn = aws_lb_target_group.target_group.arn
    type             = "forward"
  }
}

data "aws_route53_zone" "zone" {
  name = "dylannissley.com"
}

resource "aws_acm_certificate" "nodejs_subdomain" {
  domain_name       = "nodejs.dylannissley.com"
  validation_method = "DNS"
}

resource "aws_route53_record" "nodejs_subdomain" {
  name    = aws_acm_certificate.nodejs_subdomain.domain_validation_options.0.resource_record_name
  type    = aws_acm_certificate.nodejs_subdomain.domain_validation_options.0.resource_record_type
  zone_id = data.aws_route53_zone.zone.zone_id
  records = [aws_acm_certificate.nodejs_subdomain.domain_validation_options.0.resource_record_value]
  ttl     = "60"
}

resource "aws_acm_certificate_validation" "nodejs_subdomain" {
  certificate_arn = aws_acm_certificate.nodejs_subdomain.arn
  validation_record_fqdns = [aws_route53_record.nodejs_subdomain.fqdn]
}

