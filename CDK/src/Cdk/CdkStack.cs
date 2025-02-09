using Amazon.CDK;
using Amazon.CDK.AWS.CertificateManager;
using Amazon.CDK.AWS.CloudFront;
using Amazon.CDK.AWS.CloudFront.Origins;
using Amazon.CDK.AWS.Route53;
using Amazon.CDK.AWS.Route53.Targets;
using Amazon.CDK.AWS.S3;
using Amazon.CDK.AWS.S3.Deployment;
using Constructs;

namespace Cdk
{
    public class CdkStack : Stack
    {
        internal CdkStack(Construct scope, string id, IStackProps props = null) : base(scope, id, props)
        {
            string appName = System.Environment.GetEnvironmentVariable("APP_NAME")!;
            string arnCertificate = System.Environment.GetEnvironmentVariable("CERTIFICATE_ARN")!;
            string domainName = System.Environment.GetEnvironmentVariable("DOMAIN_NAME")!;
            string buildDirectory = System.Environment.GetEnvironmentVariable("BUILD_DIR")!;
            string rootObject = System.Environment.GetEnvironmentVariable("ROOT_OBJECT")!;
            string subdomainName = System.Environment.GetEnvironmentVariable("SUBDOMAIN_NAME")!;


            // Se obtiene el certificado existente...
            ICertificate certificate = Certificate.FromCertificateArn(this, $"{appName}FrontendCertificate", arnCertificate);

            // Se obtiene el hosted zone existente...
            IHostedZone hostedZone = HostedZone.FromLookup(this, $"{appName}FrontendHostedZone", new HostedZoneProviderProps {
                DomainName = domainName,
            });

            // Se crea bucket donde se almacenará aplicación frontend...  
            Bucket bucket = new Bucket(this, $"{appName}FrontendS3Bucket", new BucketProps {
                Versioned = false,
                RemovalPolicy = RemovalPolicy.DESTROY,
                BlockPublicAccess = BlockPublicAccess.BLOCK_ALL,
                BucketName = $"{appName.ToLower()}-frontend-s3-bucket"
            });

            // Se despliegan piezas del frontend en el bucket...
            BucketDeployment deployment = new BucketDeployment(this, $"{appName}FrontendDeployment", new BucketDeploymentProps {
                Sources = new[] { Source.Asset(buildDirectory) },
                DestinationBucket = bucket,
            });

            // Se crea distribución de cloudfront...
            Distribution distribution = new Distribution(this, $"{appName}FrontendDistribution", new DistributionProps {
                Comment = $"{appName} Frontend Distribution",
                DefaultRootObject = rootObject,
                DomainNames = new[] { subdomainName },
                DefaultBehavior = new BehaviorOptions {
                    Origin = S3BucketOrigin.WithOriginAccessControl(bucket),
                    Compress = true,
                    AllowedMethods = AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                    ViewerProtocolPolicy = ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                },
                Certificate = certificate,
                ErrorResponses = new[] {
                    new ErrorResponse {
                        HttpStatus = 403,
                        ResponseHttpStatus = 200,
                        ResponsePagePath = $"/{rootObject}",
                    },
                    new ErrorResponse {
                        HttpStatus = 404,
                        ResponseHttpStatus = 200,
                        ResponsePagePath = $"/{rootObject}",
                    },
                }
            });

            // Se crea record en hosted zone...
            ARecord record = new ARecord(this, $"{appName}FrontendARecord", new ARecordProps {
                Zone = hostedZone,
                RecordName = subdomainName,
                Target = RecordTarget.FromAlias(new CloudFrontTarget(distribution)),
            });
        }
    }
}
